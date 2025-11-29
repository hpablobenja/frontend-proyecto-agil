
"use client";

import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";

type User = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
};

export default function UsersPage() {

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "admin",
      fullname: "Administrador de sistema",
      email: "Admin@sistema.com",
      phone: "76539823",
      role: "Administrativo",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80&auto=format&fit=crop",
    },
    {
      id: "2",
      username: "angela23",
      fullname: "Angela Salazar",
      email: "Angi@sistema.com",
      phone: "76539823",
      role: "vendedor",
      avatar:
        "https://images.unsplash.com/photo-1763560276646-8315f3fe55f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUyfHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D",
    },
  ]);

  
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    ci: "",
    role: "",
    username: "",
  });

  function resetForm() {
    setForm({ fullname: "", email: "", phone: "", ci: "", role: "", username: "" });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.fullname || !form.email) {
      alert("Completa nombre y email");
      return;
    }
    const newUser: User = {
      id: String(Date.now()),
      username: form.username || form.email.split("@")[0],
      fullname: form.fullname,
      email: form.email,
      phone: form.phone,
      role: form.role || "Usuario",
      avatar: undefined,
    };
    setUsers((u) => [newUser, ...u]);
    setOpen(false);
    resetForm();
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar usuario?")) return;
    setUsers((u) => u.filter((x) => x.id !== id));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif">Gestión de usuarios</h1>

        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3f51b5] hover:bg-[#3647a8] text-white px-4 py-3 rounded-md flex items-center gap-2">
              <span>Nuevo usuario</span>
              <Plus className="w-5 h-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-center text-xl text-[#3f51b5]">
                Registrar Usuario
              </DialogTitle>
              <DialogDescription className="text-center mb-4">
                Llena los datos para crear un nuevo usuario
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 py-2">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="fullname">Nombre completo</Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    placeholder="Nombre completo"
                    value={form.fullname}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Correo electronico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Correo electronico"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Telefono"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="ci">Cedula de identidad</Label>
                  <Input
                    id="ci"
                    name="ci"
                    placeholder="Cedula de identidad"
                    value={form.ci}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="role">Cargo</Label>
                  <Select
                    onValueChange={(v) => setForm((s) => ({ ...s, role: v }))}
                    value={form.role}
                  >
                    <SelectTrigger id="role" className="w-full">
                      <SelectValue placeholder="Cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrativo">Administrativo</SelectItem>
                      <SelectItem value="Vendedor">Vendedor</SelectItem>
                      <SelectItem value="Bodeguero">Bodeguero</SelectItem>
                      <SelectItem value="Usuario">Usuario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between mt-2">
                <div className="flex gap-4">
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
                </div>

                <div>
                  <Button type="submit" className="bg-[#3f51b5] hover:bg-[#3647a8] text-white px-6 py-3">
                    Aceptar
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Nombre completo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      {u.avatar ? <AvatarImage src={u.avatar} alt={u.username} /> : <AvatarFallback>{u.username[0]?.toUpperCase()}</AvatarFallback>}
                    </Avatar>
                    <div className="text-sm">{u.username}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{u.fullname}</TableCell>
                <TableCell className="text-sm">{u.email}</TableCell>
                <TableCell className="text-sm">{u.phone}</TableCell>
                <TableCell className="text-sm">{u.role}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-3 justify-end">
                    <Button asChild size="sm" variant="ghost">
                      <button onClick={() => alert("Editar listo (implementar)")}>
                        <Pencil className="text-blue-600" />
                      </button>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <button onClick={() => handleDelete(u.id)}>
                        <Trash2 className="text-red-600" />
                      </button>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
