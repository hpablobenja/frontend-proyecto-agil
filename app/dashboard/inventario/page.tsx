
"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category?: string;
  stock: number;
  minStock?: number;
  avatar?: string;
};

type Movement = {
  id: string;
  type: "Entrada" | "Salida";
  productId: string;
  qty: number;
  motive?: string;
  actor?: string; 
  date: string; 
};

export default function InventoryPage() {
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Galleta chocolate",
      category: "Galleta",
      stock: 100,
      minStock: 50,
      avatar:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=64&q=80&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Galleta vainilla",
      category: "Galleta",
      stock: 40,
      minStock: 10,
    },
  ]);

  
  const [movements, setMovements] = useState<Movement[]>(() => {
  const now = new Date();

  return [
    {
      id: "m1",
      type: "Entrada",
      productId: "1",
      qty: 20,
      motive: "Ingreso por compra",
      actor: "vendedor",
      date: now.toISOString(),
    },
    {
      id: "m2",
      type: "Salida",
      productId: "2",
      qty: 20,
      motive: "Venta mostrador",
      actor: "vendedor",
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];
});

  
  const [tab, setTab] = useState<"stock" | "movements">("stock");

  
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "" as "" | "Entrada" | "Salida",
    productId: "",
    qty: "",
    motive: "",
    actor: "",
  });

  const productOptions = useMemo(
    () => products.map((p) => ({ value: p.id, label: p.name })),
    [products]
  );

  function resetForm() {
    setForm({ type: "", productId: "", qty: "", motive: "", actor: "" });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleCreateMovement(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.type || !form.productId || !form.qty) {
      alert("Completa tipo, producto y cantidad");
      return;
    }
    const qty = Number(form.qty);
    if (isNaN(qty) || qty <= 0) {
      alert("Cantidad inválida");
      return;
    }

    const prodIndex = products.findIndex((p) => p.id === form.productId);
    if (prodIndex === -1) {
      alert("Producto no válido");
      return;
    }

    
    setProducts((prev) => {
      const copy = [...prev];
      if (form.type === "Entrada") {
        copy[prodIndex] = { ...copy[prodIndex], stock: copy[prodIndex].stock + qty };
      } else {
        copy[prodIndex] = { ...copy[prodIndex], stock: Math.max(0, copy[prodIndex].stock - qty) };
      }
      return copy;
    });

    const newMov: Movement = {
      id: String(Date.now()),
      type: form.type as "Entrada" | "Salida",
      productId: form.productId,
      qty,
      motive: form.motive,
      actor: form.actor || "usuario",
      date: new Date().toISOString(),
    };

    setMovements((m) => [newMov, ...m]);
    setOpen(false);
    resetForm();
    setTab("movements");
  }

  const getProductById = (id: string) => products.find((p) => p.id === id);

  
  function formatDateTime(iso: string) {
    const d = new Date(iso);
   
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return { date: `${day}/${month}/${year}`, time: `${hours}:${minutes}` };
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-serif">Gestión de inventario</h1>

        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3f51b5] hover:bg-[#3647a8] text-white px-4 py-3 rounded-md flex items-center gap-2">
              <span>Registrar movimiento</span>
              <Plus className="w-5 h-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-center text-xl text-[#3f51b5]">
                Registro movimiento
              </DialogTitle>
              <DialogDescription className="text-center mb-4">
                Registra una entrada o salida de inventario
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateMovement} className="space-y-4 py-2">
              <div>
                <Label htmlFor="type">Tipo movimiento</Label>
                <Select
                  onValueChange={(v) => setForm((s) => ({ ...s, type: v as "Entrada" | "Salida" }))}
                  value={form.type}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Tipo movimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Salida">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="product">Producto</Label>
                <Select
                  onValueChange={(v) => setForm((s) => ({ ...s, productId: v }))}
                  value={form.productId}
                >
                  <SelectTrigger id="product" className="w-full">
                    <SelectValue placeholder="Producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="qty">Cantidad</Label>
                <Input
                  id="qty"
                  name="qty"
                  type="number"
                  min={1}
                  placeholder="Cantidad"
                  value={form.qty}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="actor">Realizado por</Label>
                <Input
                  id="actor"
                  name="actor"
                  placeholder="Vendedor / Usuario"
                  value={form.actor}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="motive">Motivo</Label>
                <Textarea
                  id="motive"
                  name="motive"
                  placeholder="Motivo (opcional)"
                  value={form.motive}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <DialogFooter className="flex items-center justify-between mt-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                >
                  Cancelar
                </Button>

                <Button type="submit" className="bg-[#3f51b5] hover:bg-[#3647a8] text-white px-6 py-3">
                  Aceptar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      
      <div className="mb-6">
        <div className="inline-flex border rounded">
          <button
            onClick={() => setTab("stock")}
            className={`px-4 py-2 ${tab === "stock" ? "bg-white border-r" : "bg-gray-200 border-r"}`}
          >
            Stock actual
          </button>
          <button
            onClick={() => setTab("movements")}
            className={`${tab === "movements" ? "bg-white" : "bg-gray-200"} px-4 py-2`}
          >
            Movimientos
          </button>
        </div>
      </div>

      
      {tab === "stock" && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Stock actual</TableHead>
                <TableHead>Stock mínimo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        {p.avatar ? <AvatarImage src={p.avatar} alt={p.name} /> : <AvatarFallback>{p.name[0]}</AvatarFallback>}
                      </Avatar>
                      <div>{p.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>{p.minStock ?? "-"}</TableCell>
                  <TableCell>
                    {p.minStock !== undefined && p.stock <= p.minStock ? (
                      <span className="text-red-600">Bajo</span>
                    ) : (
                      <span>Normal</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      
      {tab === "movements" && (
        <div className="space-y-6">
          {movements.length === 0 && (
            <div className="text-sm text-gray-500">No hay movimientos</div>
          )}

          {movements.map((m) => {
            const prod = getProductById(m.productId);
            const dt = formatDateTime(m.date);
            const isEntrada = m.type === "Entrada";

            return (
              <div
                key={m.id}
                className="bg-[#e6e6e6] rounded-sm p-6 relative flex items-start gap-6"
              >
                
                <div className="shrink-0 mt-1">
                  {isEntrada ? (
                    <div className="w-10 h-10 rounded flex items-center justify-center bg-transparent text-green-500">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded flex items-center justify-center bg-transparent text-red-500">
                      <TrendingDown className="w-6 h-6" />
                    </div>
                  )}
                </div>

                
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{prod?.name ?? "—"}</h3>

                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <div>
                      <strong>{m.type}:</strong> {m.qty} unidades
                    </div>
                    {m.motive && <div>Descripción: {m.motive}</div>}
                    <div>Realizado: {m.actor ?? "usuario"}</div>
                  </div>
                </div>

                
                <div className="text-right text-sm text-gray-600">
                  <div>{dt.date}</div>
                  <div>{dt.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
