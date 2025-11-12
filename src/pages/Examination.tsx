import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Stethoscope, Send, Clock } from "lucide-react";
import { toast } from "sonner";

interface Patient {
  id: string;
  queueNumber: number;
  name: string;
  age: number;
  complaint: string;
  time: string;
}

const Examination = () => {
  const [waitingPatients] = useState<Patient[]>([
    { id: "1", queueNumber: 3, name: "Budi Santoso", age: 42, complaint: "Cek rutin diabetes", time: "08:45" },
    { id: "2", queueNumber: 4, name: "Dewi Lestari", age: 30, complaint: "Flu dan batuk", time: "09:00" },
    { id: "3", queueNumber: 5, name: "Joko Susilo", age: 55, complaint: "Hipertensi", time: "09:15" },
  ]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  const handleSaveExamination = () => {
    if (!selectedPatient) return;
    
    toast.success(`Pemeriksaan ${selectedPatient.name} berhasil disimpan dan dikirim ke apotek`);
    setSelectedPatient(null);
    setDiagnosis("");
    setPrescription("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pemeriksaan Pasien</h1>
          <p className="text-muted-foreground">Kelola pemeriksaan dan diagnosis pasien</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle>Daftar Pasien Menunggu</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Antrian</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>Keluhan</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitingPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.queueNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.age} tahun</p>
                        </div>
                      </TableCell>
                      <TableCell>{patient.complaint}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {patient.time}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedPatient(patient)}
                            >
                              Periksa
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Pemeriksaan Pasien</DialogTitle>
                            </DialogHeader>
                            {selectedPatient && (
                              <div className="space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                  <h3 className="font-semibold mb-2">{selectedPatient.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Umur: {selectedPatient.age} tahun
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Keluhan: {selectedPatient.complaint}
                                  </p>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="diagnosis">Diagnosis</Label>
                                  <Textarea
                                    id="diagnosis"
                                    placeholder="Masukkan diagnosis pasien..."
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    rows={3}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="prescription">Resep Obat</Label>
                                  <Textarea
                                    id="prescription"
                                    placeholder="Contoh: Paracetamol 500mg - 3x sehari setelah makan"
                                    value={prescription}
                                    onChange={(e) => setPrescription(e.target.value)}
                                    rows={4}
                                  />
                                </div>

                                <Button onClick={handleSaveExamination} className="w-full">
                                  <Send className="w-4 h-4 mr-2" />
                                  Simpan & Kirim ke Apotek
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Ringkasan Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Pasien</p>
                  <p className="text-2xl font-bold text-primary">18</p>
                </div>
                <div className="p-4 bg-success/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Selesai Diperiksa</p>
                  <p className="text-2xl font-bold text-success">15</p>
                </div>
                <div className="p-4 bg-warning/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Sedang Menunggu</p>
                  <p className="text-2xl font-bold text-warning">{waitingPatients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Examination;
