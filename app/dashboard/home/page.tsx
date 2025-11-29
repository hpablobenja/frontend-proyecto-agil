"use client";

import React from "react";
import { Users, Box, Tag, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function StatCard({ title, value, icon }: { title: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Card>
      <div className="flex items-center justify-between p-6">
        <div>
          <div className="text-sm text-gray-600 font-medium">{title}</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Usuarios"
          value={4}
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />

        <StatCard
          title="Productos"
          value={6}
          icon={<Box className="w-6 h-6 text-blue-600" />}
        />

        <StatCard
          title="Ventas totales"
          value={<span>$ 0.00</span>}
          icon={<Tag className="w-6 h-6 text-blue-600" />}
        />

        <StatCard
          title="Stock bajo"
          value={2}
          icon={<AlertCircle className="w-6 h-6 text-red-500" />}
        />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-medium mb-4">Movimientos recientes</h2>

          <div className="space-y-4">
            
            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-sm">Venta #001</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">1 unidad - Galleta sabor vainilla</div>
              </CardContent>
              <CardFooter className="text-xs text-gray-500">Hoy 10:12</CardFooter>
            </Card>

            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-sm">Ingreso de stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">5 unidades - Producto: Caja azul</div>
              </CardContent>
              <CardFooter className="text-xs text-gray-500">Ayer 16:40</CardFooter>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">Productos más vendidos</h2>

          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center">
                <Avatar className="mr-4 w-12 h-12">
                  <AvatarImage src="/products/product-1.jpg" alt="Producto 1" />
                  <AvatarFallback>G1</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Galleta Vainilla</div>
                  <div className="text-sm text-gray-600">Vendidas: 12</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center">
                <Avatar className="mr-4 w-12 h-12">
                  <AvatarImage src="/products/product-2.jpg" alt="Producto 2" />
                  <AvatarFallback>G2</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Galleta Chocolate</div>
                  <div className="text-sm text-gray-600">Vendidas: 8</div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}