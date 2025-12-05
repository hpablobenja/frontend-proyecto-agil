// app/dashboard/ventas/page.tsx → VERSIÓN SIMPLIFICADA (solo unidad) - CON TIPO_PAGO
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
import { DollarSign, Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner"

// Tipos de pago permitidos
const TIPOS_PAGO = ["efectivo", "tarjeta", "transferencia"];

type Product = {
  id: string;
  nombre: string;
  precio: number;
  stock_actual: number;
};

type Sale = {
  id: string;
  total: number;
  fecha: string;
  username: string;
  tipo_pago: string; // ✨ Añadido tipo_pago
  detalles: Array<{
    producto_id: string;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
  }>;
};
type Detalle = {
  producto_id: string;
  cantidad: number;
};

export default function VentasPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = useState<string>(""); // ✨ Nuevo estado para el tipo de pago


  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ventas] = await Promise.all([
        api("/productos"),
        api("/ventas?limit=50"),
      ]);
      setProducts(prods);
      setSales(ventas.map((v: any) => ({
        ...v,
        detalles: v.detalles ?? [] 
      })));

    } catch (error: any) {
        console.error("Login error:", error);
        toast.error(
          error.message,
          { duration: 4000 }
        )} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addDetalle = () => {
    setDetalles([...detalles, { producto_id: "", cantidad: 1 }]);
  };

  const removeDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const updateDetalle = <K extends keyof Detalle>(
  index: number,
  field: K,
  value: Detalle[K]
) => {
  const nuevos = [...detalles];
  nuevos[index][field] = value;
  setDetalles(nuevos);
};


  const totalVenta = detalles.reduce((sum, d) => {
    const producto = products.find(p => p.id === d.producto_id);
    return sum + (producto ? producto.precio * d.cantidad : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✨ Validación del tipo de pago
    if (!tipoPagoSeleccionado) {
        toast.error("Selecciona un tipo de pago");
        return;
    }
    
    if (detalles.length === 0 || detalles.some(d => !d.producto_id || d.cantidad <= 0)) {
      toast.error("Completa todos los productos y cantidades");
      return;
    }

    const payload = {
      tipo_pago: tipoPagoSeleccionado, // ✨ Enviando tipo_pago
      detalles: detalles.map(d => ({
        producto_id: d.producto_id,
        cantidad: d.cantidad,
      })),
    };

    try {
      await api("/ventas", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("¡Venta registrada!", {
                description: `Total: Bs. ${totalVenta.toFixed(2)}`,
                duration: 3000,
              });
      setOpen(false);
      setDetalles([]);
      setTipoPagoSeleccionado(""); // ✨ Limpiar tipo de pago
      loadData();
    } catch (err: any) {
      toast.error("Stock insuficiente o error");

    }
  };
  
  // ✨ Función para abrir el modal y reiniciar estados
  const handleOpenNewSale = () => {
      setDetalles([]);
      setTipoPagoSeleccionado(TIPOS_PAGO[0]); // Seleccionar el primero por defecto
      setOpen(true);
  };


  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ventas</h1>
        <Button onClick={handleOpenNewSale} className="bg-[#3F51B5]"> {/* ✨ Usar nueva función */}
          <Plus className="mr-2 h-5 w-5" /> Nueva Venta
        </Button>
      </div>

      <div className="text-2xl font-bold text-green-600">
        Ingresos totales: Bs. {sales.reduce((s, v) => s + Number(v.total), 0).toFixed(2)}
      </div>

      <div className="space-y-6">
        {loading ? (
          <p>Cargando...</p>
        ) : sales.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No hay ventas registradas</p>
        ) : (
          sales.map((venta) => (
            <div key={venta.id} className="bg-gray-50 rounded-lg p-6 flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Venta #{venta.id}</h3>
                    {/* ✨ Mostrar tipo_pago */}
                    <p className="text-sm text-gray-600">Por: {venta.username} | Pago: **{venta.tipo_pago}**</p> 
                    <p className="text-xs text-gray-500">{formatDate(venta.fecha)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">Bs. {Number(venta.total).toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-3 text-sm space-y-1">
                  {venta.detalles.map((d, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{d.cantidad} × {d.nombre}</span>
                      <span>Bs. {(d.cantidad * d.precio_unitario).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nueva Venta - SIMPLIFICADO */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Venta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ✨ Campo Tipo de Pago */}
            <div className="space-y-2">
                <Label htmlFor="tipo-pago">Tipo de Pago</Label>
                <Select
                    value={tipoPagoSeleccionado}
                    onValueChange={setTipoPagoSeleccionado}
                >
                    <SelectTrigger id="tipo-pago">
                        <SelectValue placeholder="Seleccionar tipo de pago" />
                    </SelectTrigger>
                    <SelectContent>
                        {TIPOS_PAGO.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                                {tipo}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>


            {/* Lista de Detalles de la Venta */}
            <div className="space-y-4">
              {detalles.map((detalle, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end border-b pb-4">
                  <div className="col-span-7">
                    <Label>Producto</Label>
                    <Select
                      value={detalle.producto_id}
                      onValueChange={(v) => updateDetalle(index, "producto_id", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nombre} - Bs. {p.precio} (Stock: {p.stock_actual})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={detalle.cantidad}
                      onChange={(e) => updateDetalle(index, "cantidad", Number(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDetalle(index)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addDetalle} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Agregar producto
              </Button>
            </div>

            <div className="text-right text-2xl font-bold text-green-600">
              Total: Bs. {totalVenta.toFixed(2)}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#3F51B5]" disabled={detalles.length === 0 || totalVenta === 0 || !tipoPagoSeleccionado}>
                Registrar Venta
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}