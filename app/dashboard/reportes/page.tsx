// app/dashboard/reportes/page.tsx → VERSIÓN CON BOTONES DE REPORTE PDF
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "@/lib/api";
import { toast } from "sonner";

type ReportePeriodo = {
  periodo: string;
  total_ventas: number;
  total_ventas_monto: number;
};

type TopProducto = {
  nombre: string;
  cantidad: number;
  total: number;
};

// ** ASUMIENDO QUE EL ROL SE OBTIENE DEL CONTEXTO O DE UNA SESIÓN **
// Placeholder para obtener el rol del usuario
const useUserRole = () => {
    // Esto debería ser reemplazado por la lógica real de tu aplicación (e.g., useSession, Context)
    // Para la demo, asumimos 'admin' para mostrar todos los botones
    return 'admin'; // O 'empleado'
};


export default function ReportesPage() {
  const [periodo, setPeriodo] = useState<"dia" | "semana" | "mes">("dia");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [datos, setDatos] = useState<ReportePeriodo[]>([]);
  const [topProductos, setTopProductos] = useState<TopProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = useUserRole(); // Obtener el rol

  const loadReporte = async () => {
    setLoading(true);
    try {
      let url = `/reportes/data?periodo=${periodo}`;
      if (desde) url += `&fecha_desde=${desde}`;
      if (hasta) url += `&fecha_hasta=${hasta}`;

      // En el frontend original, se asume que las ventas traen los detalles (v.detalles)
      // Pero si la ruta /ventas no trae detalles (como en el backend original), debemos usar otra estrategia
      // **Asumo que /ventas?limit=100 trae los detalles**
      
      const [reporteRes, ventasRes] = await Promise.all([
        api(url),
        api("/ventas?limit=100"), // más ventas para top productos
      ]);

      const datosNormalizados: ReportePeriodo[] = Array.isArray(reporteRes)
      ? reporteRes.map((item: any) => {
      let fecha = "Sin fecha";
      if (item.periodo) {
        const d = new Date(item.periodo);
        // Ajustar manualmente a GMT-4 (Bolivia)
        const offsetMs = 4 * 60 * 60 * 1000; // 4 horas en ms
        const boliviaTime = new Date(d.getTime() - offsetMs);
        fecha = boliviaTime.toISOString().replace("T", " ").substring(0, 19);
      }
      return {
        periodo: fecha,
        total_ventas: Number(item.total_ventas) || 0,
        total_ventas_monto: Number(item.total_ventas_monto) || 0,
      };
    })
  : [];


      setDatos(datosNormalizados);

      // Top productos (mejorado)
      const map = new Map<string, { cantidad: number; total: number; nombre: string }>();
      // Es muy probable que /api/ventas no incluya detalles_ventas.
      // Aquí se asume que /api/ventas?limit=100 trae la lista de IDs de venta, 
      // y luego se debería cargar cada detalle (lo cual es ineficiente),
      // o se asume que el backend modificó /api/ventas para incluir json_agg de detalles.
      // Por simplicidad en este ejemplo, se sigue la lógica original de intentar leer v.detalles:
      ventasRes.forEach((v: any) => {
        if (v.detalles && Array.isArray(v.detalles)) {
          v.detalles.forEach((d: any) => {
            const key = d.producto_id || d.id;
            const existente = map.get(key) || { cantidad: 0, total: 0, nombre: d.nombre || "Desconocido" };
            existente.cantidad += Number(d.cantidad) || 0;
            existente.total += (Number(d.cantidad) || 0) * (Number(d.precio_unitario) || 0);
            existente.nombre = d.nombre || existente.nombre;
            map.set(key, existente);
          });
        }
      });

      const top = Array.from(map.values())
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);
      setTopProductos(top);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar reportes");
      setDatos([]);
      setTopProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReporte();
  }, [periodo, desde, hasta]);

  // Función para descargar el PDF
  const handleDownload = async (reporteTipo: 'ventas' | 'inventario' | 'productos' | 'usuarios') => {
    try {
      toast.info(`Generando reporte de ${reporteTipo}...`);
      
      // Construir la URL del backend
      let url = `/reportes/${reporteTipo}`; 
      let params = new URLSearchParams();

      if (reporteTipo === 'ventas') {
        if (desde) params.append('fecha_desde', desde);
        if (hasta) params.append('fecha_hasta', hasta);
        url += `?${params.toString()}`;
      } else if (reporteTipo === 'inventario') {
         // Lógica si se requieren filtros de inventario
      } else if (reporteTipo === 'productos') {
         // Lógica si se requieren filtros de productos
      }

      const blob = await api(url, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const filename = `${reporteTipo}_${new Date().toISOString().split("T")[0]}.pdf`;

const downloadUrl = window.URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = downloadUrl;
a.download = filename;
document.body.appendChild(a);
a.click();
a.remove();
window.URL.revokeObjectURL(downloadUrl);

toast.success(`Reporte de ${reporteTipo} descargado con éxito.`);;
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || `Fallo al generar el reporte de ${reporteTipo}.`);
    }
  };


  // Cálculos seguros contra NaN
  const totalIngresos = datos.reduce((sum, d) => sum + (Number(d.total_ventas_monto) || 0), 0);
  const totalVentas = datos.reduce((sum, d) => sum + (Number(d.total_ventas) || 0), 0);
  const promedioVenta = totalVentas > 0 ? totalIngresos / totalVentas : 0;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reportes de Ventas</h1>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Período</Label>
              <Select value={periodo} onValueChange={(v: any) => setPeriodo(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Diario</SelectItem>
                  <SelectItem value="semana">Semanal</SelectItem>
                  <SelectItem value="mes">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Desde</Label>
              <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </div>
            <div>
              <Label>Hasta</Label>
              <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={loadReporte} className="w-full bg-[#3F51B5]">
                Actualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Resumen (Sin cambios) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">Bs. {totalIngresos.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVentas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Promedio por Venta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              Bs. {promedioVenta.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico (Sin cambios) */}
      <Card>
        <CardHeader>
          <CardTitle>
            Ventas por {periodo === "dia" ? "Día" : periodo === "semana" ? "Semana" : "Mes"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-10">Cargando gráfico...</p>
          ) : datos.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No hay datos para mostrar</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={datos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="periodo" 
                  angle={datos.length > 10 ? -45 : 0}
                  textAnchor={datos.length > 10 ? "end" : "middle"}
                  height={datos.length > 10 ? 80 : 60}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value: any) => Number(value).toFixed(2)} />
                <Legend />
                <Bar yAxisId="left" dataKey="total_ventas" fill="#3F51B5" name="N° Ventas" />
                <Bar yAxisId="right" dataKey="total_ventas_monto" fill="#1010B981" name="Ingresos (Bs.)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Productos (Sin cambios) */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Productos Más Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          {topProductos.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No hay ventas registradas</p>
          ) : (
            <div className="space-y-4">
              {topProductos.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-600" : "bg-gray-300"
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{p.nombre}</p>
                      <p className="text-sm text-gray-600">{p.cantidad} unidades</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-green-600">Bs. {p.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Nuevos botones de Reporte PDF */}
      <Card className="border-red-500 border-2">
        <CardHeader>
          <CardTitle className="text-xl">📊 Generación de Reportes PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => handleDownload('ventas')}
              className="bg-red-600 hover:bg-red-700"
            >
              Ventas (con detalles)
            </Button>
            <Button 
              onClick={() => handleDownload('inventario')}
              className="bg-red-600 hover:bg-red-700"
            >
              Inventario
            </Button>
            <Button 
              onClick={() => handleDownload('productos')}
              className="bg-red-600 hover:bg-red-700"
            >
              Productos
            </Button>
            {userRole === 'admin' && (
              <Button 
                onClick={() => handleDownload('usuarios')}
                className="bg-red-600 hover:bg-red-700"
              >
                Usuarios (Solo Admin)
              </Button>
            )}
            {userRole !== 'admin' && (
                <div className="flex items-center justify-center text-sm text-gray-500 col-span-1 md:col-span-1">
                    Solo visible para Administradores
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}