// app/dashboard/home/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import api from "@/lib/api";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalProductos: 0,
    stockBajo: 0,
    ventasHoy: { count: 0, total: 0 },
    movimientosHoy: 0,
    user: { username: "", role: "" },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await api("/dashboard");
        setStats(data);
      } catch (err) {
        // toast ya maneja el error
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Cargando dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bienvenido, {stats.user.username}!</h1>
        <p className="text-gray-600">Resumen del día de hoy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Productos Totales</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Number(stats.totalProductos)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Stock Bajo (≤10)</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{Number(stats.stockBajo)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Number(stats.ventasHoy.count)}</p>
            <p className="text-sm text-gray-600">Bs. {Number(stats.ventasHoy.total).toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              Bs. {Number(stats.ventasHoy.total).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}