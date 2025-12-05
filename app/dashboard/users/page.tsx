// app/dashboard/users/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, Shield } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner"

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "empleado" });

  const loadUsers = async () => {
    try {
      const data = await api("/auth/users"); // ← Necesitas este endpoint en el backend
      setUsers(data);
    } catch (err) {
      toast.error("No se pudieron cargar usuarios");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api(`/auth/users/${editing.id}`, { method: "PUT", body: JSON.stringify(form) });
        toast.success("Usuario actualizado", {
                        duration: 3000,
                      });
      } else {
        await api("/auth/register", { method: "POST", body: JSON.stringify(form) });
        toast.success("Usuario creado", {
                        duration: 3000,
                      });
      }
      setOpen(false);
      setEditing(null);
      setForm({ username: "", email: "", password: "", role: "empleado" });
      loadUsers();
    } catch (err: any) {
      toast.error("No se pudo guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
      await api(`/auth/users/${id}`, { method: "DELETE" });
      toast.success("Usuario eliminado", {
                        duration: 3000,
                      });
      loadUsers();
    } catch (err) {
      toast.error("No se pudo eliminar");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <Button onClick={() => { setEditing(null); setForm({ username: "", email: "", password: "", role: "empleado" }); setOpen(true); }} className="bg-[#3F51B5]">
          <Plus className="mr-2 h-5 w-5" /> Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <Card key={u.id} className="relative">
            <div className="absolute top-3 right-3 flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(u); setForm({ username: u.username, email: u.email, password: "", role: u.role }); setOpen(true); }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(u.id)}>
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
            <CardContent className="pt-10 pb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback>{u.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{u.username}</h3>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className={`h-4 w-4 ${u.role === "admin" ? "text-red-600" : "text-green-600"}`} />
                    <span className="text-sm font-medium">{u.role.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar" : "Nuevo"} Usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Usuario</Label>
              <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label>Contraseña {editing ? "(dejar vacío para no cambiar)" : ""}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} />
            </div>
            <div>
              <Label>Rol</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="empleado">Empleado</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#3F51B5]">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}