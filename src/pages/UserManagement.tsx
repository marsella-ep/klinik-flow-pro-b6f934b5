import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Search, Plus, Pencil, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/contexts/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Admin Klinik", email: "admin@sentosa.com", role: "admin", status: "active" },
    { id: "2", name: "Dr. Budi Santoso", email: "doctor@sentosa.com", role: "doctor", status: "active" },
    { id: "3", name: "Apt. Sarah Wijaya", email: "pharmacist@sentosa.com", role: "pharmacist", status: "active" },
    { id: "4", name: "Siti Nurhaliza", email: "receptionist@sentosa.com", role: "receptionist", status: "active" },
    { id: "5", name: "Ahmad Dahlan", email: "staff@sentosa.com", role: "staff", status: "active" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "" as UserRole | "",
    password: "",
  });

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role as UserRole,
      status: "active",
    };

    setUsers([...users, newUser]);
    toast.success("Pengguna berhasil ditambahkan");
    setIsAddDialogOpen(false);
    setFormData({ name: "", email: "", role: "", password: "" });
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success(`${name} berhasil dihapus`);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === "active" ? "inactive" as const : "active" as const }
        : u
    ));
    toast.success("Status pengguna berhasil diubah");
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleLabels = {
    admin: "Administrator",
    doctor: "Dokter",
    pharmacist: "Apoteker",
    receptionist: "Resepsionis",
    staff: "Petugas Administrasi",
  };

  const roleColors = {
    admin: "bg-destructive/10 text-destructive",
    doctor: "bg-primary/10 text-primary",
    pharmacist: "bg-success/10 text-success",
    receptionist: "bg-warning/10 text-warning",
    staff: "bg-muted text-muted-foreground",
  };

  const statusColors = {
    active: "bg-success/10 text-success",
    inactive: "bg-muted text-muted-foreground",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Kelola pengguna dan hak akses sistem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pengguna</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <UserCog className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktif</p>
                  <p className="text-2xl font-bold text-success">
                    {users.filter(u => u.status === "active").length}
                  </p>
                </div>
                <UserCog className="w-10 h-10 text-success opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tidak Aktif</p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {users.filter(u => u.status === "inactive").length}
                  </p>
                </div>
                <UserCog className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Daftar Pengguna
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Cari pengguna..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Pengguna
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="add-name">Nama Lengkap</Label>
                        <Input
                          id="add-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Masukkan nama"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-email">Email</Label>
                        <Input
                          id="add-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="nama@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-role">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="doctor">Dokter</SelectItem>
                            <SelectItem value="pharmacist">Apoteker</SelectItem>
                            <SelectItem value="receptionist">Resepsionis</SelectItem>
                            <SelectItem value="staff">Petugas Administrasi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-password">Password</Label>
                        <Input
                          id="add-password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Minimal 8 karakter"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddUser}>Simpan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status]}>
                        {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UserManagement;
