
"use client";

import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";



type Product = {
    id: string;
    name: string;
};

type Sale = {
    id: string;
    productId: string;
    qty: number;
    unitType: "unidad" | "media_docena" | "docena";
    unitPrice: number;
    total: number;
    actor?: string;
    date: string; 
};

export default function ReportsPage() {

    const [products] = useState<Product[]>(() => [
        { id: "1", name: "Galleta chocolate" },
        { id: "2", name: "Galleta vainilla" },
        { id: "3", name: "Galleta limon" },
    ]);

    const [sales] = useState<Sale[]>(
        () => {
            const now = new Date();
            return [
                {
                    id: "s1",
                    productId: "1",
                    qty: 2,
                    unitType: "unidad",
                    unitPrice: 17,
                    total: 34,
                    actor: "Administrador",
                    date: now.toISOString(),
                },
                {
                    id: "s2",
                    productId: "2",
                    qty: 3,
                    unitType: "unidad",
                    unitPrice: 17,
                    total: 51,
                    actor: "Vendedor",
                    date: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
                },
                {
                    id: "s2",
                    productId: "3",
                    qty: 1,
                    unitType: "unidad",
                    unitPrice: 17,
                    total: 51,
                    actor: "Vendedor",
                    date: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
                },
            ];
        }
    );

    
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");

    const printRef = useRef<HTMLDivElement | null>(null);

    

    
    const filteredSales = useMemo(() => {
        return sales.filter((s) => {
            const d = new Date(s.date);
            if (from) {
                const f = new Date(from + "T00:00:00");
                if (d < f) return false;
            }
            if (to) {
                const t = new Date(to + "T23:59:59");
                if (d > t) return false;
            }
            return true;
        });
    }, [sales, from, to]);


    
    const ingresosTotales = useMemo(() => filteredSales.reduce((acc, s) => acc + s.total, 0), [filteredSales]);
    const unidadesVendidas = useMemo(() => filteredSales.reduce((acc, s) => acc + s.qty, 0), [filteredSales]);
    const totalVentas = filteredSales.length;

    
    const topProducts = useMemo(() => {
        const map = new Map<string, { qty: number; total: number }>();
        for (const s of filteredSales) {
            const prev = map.get(s.productId) ?? { qty: 0, total: 0 };
            prev.qty += s.qty;
            prev.total += s.total;
            map.set(s.productId, prev);
        }
        const arr = Array.from(map.entries()).map(([productId, data]) => {
            const product = products.find((p) => p.id === productId);
            return {
                productId,
                name: product?.name ?? "—",
                qty: data.qty,
                total: data.total,
            };
        });
        
        arr.sort((a, b) => b.qty - a.qty);
        return arr;
    }, [filteredSales, products]);

    return (
        <div className="p-6">
            <div className="flex items-start justify-between mb-6">
                <h1 className="text-2xl font-serif">Reportes de ventas</h1>

                <div>
                    <Button className="bg-[#3f51b5] hover:bg-[#3647a8] text-white px-4 py-3 flex items-center gap-2" onClick={() => alert("Descarga (implementar en proceso)")}>
                        <span>Descarga pdf</span>
                        <Download className="w-5 h-5" />
                        
                    </Button>
                </div>
            </div>

            
            <div ref={printRef}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <Label>Fecha inicio</Label>
                        <Input type="date" className="w-[360px]" value={from} onChange={(e) => setFrom(e.target.value)} />
                    </div>
                    <div>
                        <Label>Fecha fin</Label>
                        <Input type="date" className="w-[360px]" value={to} onChange={(e) => setTo(e.target.value)} />
                    </div>
                    <div className="flex items-end gap-4">
                        <Card className="flex-1">
                            <CardContent>
                                <div className="text-sm">Ingresos Totales</div>
                                <div className="text-lg font-medium">Bs. {ingresosTotales.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1">
                            <CardContent>
                                <div className="text-sm">Unidades Vendidas</div>
                                <div className="text-lg font-medium">{unidadesVendidas}</div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1">
                            <CardContent>
                                <div className="text-sm">Total Ventas</div>
                                <div className="text-lg font-medium">{totalVentas}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                
                <section className="mb-8">
                    <h2 className="text-xl font-serif mb-4">Detalle de ventas</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left">
                                    <th className="py-2">Fecha</th>
                                    <th className="py-2">Producto</th>
                                    <th className="py-2">Cantidad</th>
                                    <th className="py-2">Unidad</th>
                                    <th className="py-2">Precio unitario</th>
                                    <th className="py-2">Total</th>
                                    <th className="py-2">Vendedor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSales.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-6 text-center text-gray-500">No hay ventas en el rango</td>
                                    </tr>
                                ) : (
                                    filteredSales.map((s) => {
                                        const prod = products.find((p) => p.id === s.productId);
                                        const d = new Date(s.date);
                                        const day = String(d.getDate()).padStart(2, "0");
                                        const month = String(d.getMonth() + 1).padStart(2, "0");
                                        const year = d.getFullYear();
                                        return (
                                            <tr key={s.id} className="align-top border-b">
                                                <td className="py-4">{`${day}/${month}/${year}`}</td>
                                                <td className="py-4">{prod?.name ?? "—"}</td>
                                                <td className="py-4">{s.qty}</td>
                                                <td className="py-4">{s.unitType}</td>
                                                <td className="py-4">Bs. {s.unitPrice}</td>
                                                <td className="py-4">Bs. {s.total}</td>
                                                <td className="py-4">{s.actor ?? "—"}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                
                <section>
                    <h2 className="text-xl font-serif mb-4">Productos mas vendidos</h2>

                    <div className="space-y-4">
                        {topProducts.length === 0 && <div className="text-sm text-gray-500">Sin datos</div>}
                        {topProducts.map((p, idx) => (
                            <div key={p.productId} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === 0 ? "bg-yellow-300" : "bg-gray-200"}`}>
                                        <span className="font-medium">{idx + 1}</span>
                                    </div>
                                    <div>
                                        <div className="font-medium">{p.name}</div>
                                        <div className="text-sm text-gray-500">{p.qty} unidades</div>
                                    </div>
                                </div>

                                <div className="text-sm font-medium">Bs. {p.total}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
