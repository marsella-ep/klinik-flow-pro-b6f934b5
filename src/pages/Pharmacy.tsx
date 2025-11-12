import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pill, CheckCircle, AlertTriangle, Package } from "lucide-react";
import { toast } from "sonner";

interface Prescription {
  id: string;
  patientName: string;
  medicines: string;
  status: "pending" | "ready" | "delivered";
  time: string;
}

interface Medicine {
  id: string;
  name: string;
  stock: number;
  status: "safe" | "low";
}

const Pharmacy = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { id: "1", patientName: "Ahmad Wijaya", medicines: "Paracetamol 500mg, Amoxicillin 500mg", status: "delivered", time: "10:30" },
    { id: "2", patientName: "Siti Rahayu", medicines: "Ibuprofen 400mg, Cetirizine 10mg", status: "ready", time: "10:45" },
    { id: "3", patientName: "Budi Santoso", medicines: "Metformin 500mg, Captopril 25mg", status: "pending", time: "11:00" },
  ]);

  const [lowStockMedicines] = useState<Medicine[]>([
    { id: "1", name: "Amoxicillin 500mg", stock: 15, status: "low" },
    { id: "2", name: "Cetirizine 10mg", stock: 8, status: "low" },
    { id: "3", name: "Omeprazole 20mg", stock: 12, status: "low" },
  ]);

  const handleConfirmMedicine = (id: string) => {
    setPrescriptions(prescriptions.map(p => 
      p.id === id ? { ...p, status: "ready" as const } : p
    ));
    toast.success("Obat dikonfirmasi siap diambil");
  };

  const handleDeliverMedicine = (id: string) => {
    setPrescriptions(prescriptions.map(p => 
      p.id === id ? { ...p, status: "delivered" as const } : p
    ));
    toast.success("Obat telah diserahkan ke pasien");
  };

  const statusColors = {
    pending: "bg-warning/10 text-warning",
    ready: "bg-primary/10 text-primary",
    delivered: "bg-success/10 text-success",
  };

  const statusLabels = {
    pending: "Sedang Diproses",
    ready: "Siap Diambil",
    delivered: "Sudah Diserahkan",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Resep & Apotek</h1>
          <p className="text-muted-foreground">Kelola resep dan stok obat klinik</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle>Daftar Resep</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>Obat</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">{prescription.patientName}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto text-left">
                              {prescription.medicines}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detail Resep</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <p className="font-medium">Pasien: {prescription.patientName}</p>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Daftar Obat:</p>
                                {prescription.medicines.split(", ").map((med, idx) => (
                                  <div key={idx} className="p-2 bg-muted/50 rounded text-sm">
                                    {med}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>{prescription.time}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[prescription.status]}>
                          {statusLabels[prescription.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {prescription.status === "pending" && (
                            <Button 
                              size="sm" 
                              onClick={() => handleConfirmMedicine(prescription.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Konfirmasi
                            </Button>
                          )}
                          {prescription.status === "ready" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeliverMedicine(prescription.id)}
                            >
                              Serahkan
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Ringkasan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-warning/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Resep Pending</p>
                    <p className="text-2xl font-bold text-warning">
                      {prescriptions.filter(p => p.status === "pending").length}
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Siap Diambil</p>
                    <p className="text-2xl font-bold text-primary">
                      {prescriptions.filter(p => p.status === "ready").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Stok Menipis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockMedicines.map((medicine) => (
                    <div key={medicine.id} className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                      <p className="font-medium text-sm">{medicine.name}</p>
                      <p className="text-sm text-warning">Sisa: {medicine.stock} unit</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pharmacy;
