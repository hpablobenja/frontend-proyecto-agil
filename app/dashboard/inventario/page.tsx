// app/dashboard/inventario/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Package } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner"

type Product = {
  id: string;
  nombre: string;
  stock_actual: number;
};

type Movement = {
  id: string;
  producto_id: string;
  producto_nombre: string;
  tipo: "entrada" | "salida";
  cantidad: number;
  motivo?: string;
  username: string;
  fecha: string;
};

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    producto_id: "",
    tipo: "entrada" as "entrada" | "salida",
    cantidad: "",
    motivo: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, movs] = await Promise.all([
        api("/productos"),
        api("/inventario/movimientos"),
      ]);
      setProducts(prods);
      setMovements(movs);
    } catch (err) {
      // toast ya lo maneja
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.producto_id || !form.cantidad || Number(form.cantidad) <= 0) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      await api("/inventario/movimiento", {
        method: "POST",
        body: JSON.stringify({
          producto_id: form.producto_id,
          tipo: form.tipo,
          cantidad: Number(form.cantidad),
          motivo: form.motivo || undefined,
        }),
      });

      toast.success("Éxito", {
                description: `Movimiento de ${form.tipo} registrado`,
                duration: 3000,
              });
      setOpen(false);
      setForm({ producto_id: "", tipo: "entrada", cantidad: "", motivo: "" });
      loadData();
    } catch (err: any) {
      toast.error("No se pudo registrar");
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventario</h1>
        <Button onClick={() => setOpen(true)} className="bg-[#3F51B5]">
          <Package className="mr-2 h-5 w-5" /> Nuevo Movimiento
        </Button>
      </div>

      {/* Tabla de Stock Actual */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Stock Actual</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Stock Actual</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell className="text-right">{p.stock_actual}</TableCell>
                  <TableCell className="text-center">
                    {p.stock_actual <= 10 ? (
                      <span className="text-red-600 font-semibold">Bajo</span>
                    ) : (
                      <span className="text-green-600">Normal</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Historial de Movimientos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Movimientos Recientes</h2>
        <div className="space-y-4">
          {movements.length === 0 ? (
            <p className="text-gray-500">No hay movimientos registrados</p>
          ) : (
            movements.map((m) => (
              <div key={m.id} className="bg-gray-50 rounded-lg p-5 flex items-start gap-4">
                <div className={`p-3 rounded-full ${m.tipo === "entrada" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                  {m.tipo === "entrada" ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{m.producto_nombre}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>{m.tipo.toUpperCase()}:</strong> {m.cantidad} unidades
                    {m.motivo && ` · ${m.motivo}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Por: {m.username} · {formatDate(m.fecha)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Nuevo Movimiento */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Movimiento de Inventario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Producto</Label>
              <Select value={form.producto_id} onValueChange={(v) => setForm({ ...form, producto_id: v })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre} (Stock: {p.stock_actual})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(v: "entrada" | "salida") => setForm({ ...form, tipo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="salida">Salida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cantidad</Label>
              <Input
                type="number"
                min="1"
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Motivo (opcional)</Label>
              <Input
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="Compra, devolución, ajuste..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#3F51B5]">
                Registrar Movimiento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}