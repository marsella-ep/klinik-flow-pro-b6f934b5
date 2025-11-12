import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Medicine {
  id: string;
  name: string;
  stock: number;
  price: number;
  category: string;
  status: "safe" | "low" | "critical";
}

const MedicineData = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: "1", name: "Paracetamol 500mg", stock: 150, price: 5000, category: "Analgesik", status: "safe" },
    { id: "2", name: "Amoxicillin 500mg", stock: 15, price: 8000, category: "Antibiotik", status: "low" },
    { id: "3", name: "Ibuprofen 400mg", stock: 85, price: 6000, category: "Analgesik", status: "safe" },
    { id: "4", name: "Cetirizine 10mg", stock: 8, price: 3000, category: "Antihistamin", status: "critical" },
    { id: "5", name: "Metformin 500mg", stock: 120, price: 7000, category: "Antidiabetik", status: "safe" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    price: "",
    category: "",
  });

  const getStockStatus = (stock: number): "safe" | "low" | "critical" => {
    if (stock <= 10) return "critical";
    if (stock <= 30) return "low";
    return "safe";
  };

  const handleAddMedicine = () => {
    const stock = parseInt(formData.stock);
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: formData.name,
      stock: stock,
      price: parseInt(formData.price),
      category: formData.category,
      status: getStockStatus(stock),
    };

    setMedicines([...medicines, newMedicine]);
    toast.success("Data obat berhasil ditambahkan");
    setIsAddDialogOpen(false);
    setFormData({ name: "", stock: "", price: "", category: "" });
  };

  const handleDeleteMedicine = (id: string, name: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
    toast.success(`${name} berhasil dihapus`);
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    safe: "bg-success/10 text-success",
    low: "bg-warning/10 text-warning",
    critical: "bg-destructive/10 text-destructive",
  };

  const statusLabels = {
    safe: "Aman",
    low: "Stok Rendah",
    critical: "Stok Kritis",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Obat</h1>
          <p className="text-muted-foreground">Kelola inventaris dan stok obat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Obat</p>
                  <p className="text-2xl font-bold">{medicines.length}</p>
                </div>
                <Package className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stok Rendah</p>
                  <p className="text-2xl font-bold text-warning">
                    {medicines.filter(m => m.status === "low").length}
                  </p>
                </div>
                <AlertTriangle className="w-10 h-10 text-warning opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stok Kritis</p>
                  <p className="text-2xl font-bold text-destructive">
                    {medicines.filter(m => m.status === "critical").length}
                  </p>
                </div>
                <AlertTriangle className="w-10 h-10 text-destructive opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Daftar Obat
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Cari obat..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Obat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Obat Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="add-name">Nama Obat</Label>
                        <Input
                          id="add-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Contoh: Paracetamol 500mg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-stock">Stok</Label>
                        <Input
                          id="add-stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="Jumlah stok"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-price">Harga</Label>
                        <Input
                          id="add-price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="Harga per unit"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-category">Kategori</Label>
                        <Input
                          id="add-category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="Contoh: Analgesik"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddMedicine}>Simpan</Button>
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
                  <TableHead>Nama Obat</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>
                      <span className={medicine.status !== "safe" ? "font-bold" : ""}>
                        {medicine.stock} unit
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(medicine.price)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[medicine.status]}>
                        {statusLabels[medicine.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteMedicine(medicine.id, medicine.name)}
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

export default MedicineData;
