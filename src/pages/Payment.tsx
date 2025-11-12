import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CreditCard, Printer, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  patientName: string;
  services: string[];
  medicines: string[];
  total: number;
  status: "pending" | "paid";
  time: string;
}

const Payment = () => {
  const [payments, setPayments] = useState<Payment[]>([
    { 
      id: "1", 
      patientName: "Ahmad Wijaya", 
      services: ["Konsultasi Dokter"], 
      medicines: ["Paracetamol 500mg", "Amoxicillin 500mg"],
      total: 150000,
      status: "paid",
      time: "10:45"
    },
    { 
      id: "2", 
      patientName: "Siti Rahayu", 
      services: ["Konsultasi Dokter", "Pemeriksaan Lab"], 
      medicines: ["Ibuprofen 400mg"],
      total: 275000,
      status: "pending",
      time: "11:00"
    },
    { 
      id: "3", 
      patientName: "Budi Santoso", 
      services: ["Konsultasi Dokter"], 
      medicines: ["Metformin 500mg", "Captopril 25mg"],
      total: 180000,
      status: "pending",
      time: "11:15"
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleConfirmPayment = () => {
    if (!selectedPayment || !paymentMethod) {
      toast.error("Pilih metode pembayaran terlebih dahulu");
      return;
    }

    setPayments(payments.map(p => 
      p.id === selectedPayment.id ? { ...p, status: "paid" as const } : p
    ));
    
    toast.success(`Pembayaran ${selectedPayment.patientName} berhasil dikonfirmasi`);
    setSelectedPayment(null);
    setPaymentMethod("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statusColors = {
    pending: "bg-warning/10 text-warning",
    paid: "bg-success/10 text-success",
  };

  const statusLabels = {
    pending: "Belum Lunas",
    paid: "Lunas",
  };

  const todayTotal = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.total, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pembayaran</h1>
          <p className="text-muted-foreground">Kelola pembayaran dan transaksi pasien</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle>Daftar Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.patientName}</TableCell>
                      <TableCell className="font-bold text-primary">
                        {formatCurrency(payment.total)}
                      </TableCell>
                      <TableCell>{payment.time}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[payment.status]}>
                          {statusLabels[payment.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {payment.status === "pending" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  onClick={() => setSelectedPayment(payment)}
                                >
                                  Bayar
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
                                </DialogHeader>
                                {selectedPayment && (
                                  <div className="space-y-4">
                                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                                      <p className="font-semibold">{selectedPayment.patientName}</p>
                                      
                                      <div className="text-sm space-y-1">
                                        <p className="font-medium text-muted-foreground">Layanan:</p>
                                        {selectedPayment.services.map((service, idx) => (
                                          <p key={idx} className="pl-2">• {service}</p>
                                        ))}
                                      </div>

                                      <div className="text-sm space-y-1">
                                        <p className="font-medium text-muted-foreground">Obat:</p>
                                        {selectedPayment.medicines.map((medicine, idx) => (
                                          <p key={idx} className="pl-2">• {medicine}</p>
                                        ))}
                                      </div>

                                      <div className="pt-2 border-t">
                                        <p className="text-lg font-bold text-primary">
                                          Total: {formatCurrency(selectedPayment.total)}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="payment-method">Metode Pembayaran</Label>
                                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Pilih metode pembayaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="cash">Tunai</SelectItem>
                                          <SelectItem value="debit">Kartu Debit</SelectItem>
                                          <SelectItem value="transfer">Transfer Bank</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="flex gap-2">
                                      <Button onClick={handleConfirmPayment} className="flex-1">
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Konfirmasi Pembayaran
                                      </Button>
                                      <Button variant="outline" onClick={() => toast.success("Struk dicetak")}>
                                        <Printer className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          )}
                          {payment.status === "paid" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.success("Struk dicetak ulang")}
                            >
                              <Printer className="w-4 h-4" />
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
                  <DollarSign className="w-5 h-5 text-primary" />
                  Ringkasan Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(todayTotal)}
                    </p>
                  </div>
                  <div className="p-4 bg-success/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Transaksi Lunas</p>
                    <p className="text-2xl font-bold text-success">
                      {payments.filter(p => p.status === "paid").length}
                    </p>
                  </div>
                  <div className="p-4 bg-warning/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Belum Lunas</p>
                    <p className="text-2xl font-bold text-warning">
                      {payments.filter(p => p.status === "pending").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
