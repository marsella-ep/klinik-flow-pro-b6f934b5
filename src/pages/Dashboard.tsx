import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { Users, Pill, DollarSign, Calendar, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Pasien Hari Ini",
      value: "24",
      icon: Users,
      trend: { value: "+12% dari kemarin", isPositive: true }
    },
    {
      title: "Resep Hari Ini",
      value: "18",
      icon: Pill,
      trend: { value: "+8% dari kemarin", isPositive: true }
    },
    {
      title: "Pendapatan Hari Ini",
      value: "Rp 4.5 Jt",
      icon: DollarSign,
      trend: { value: "+15% dari kemarin", isPositive: true }
    },
    {
      title: "Stok Obat Menipis",
      value: "5",
      icon: Activity,
    },
  ];

  const recentActivities = [
    { time: "10:30", patient: "Ahmad Wijaya", action: "Pemeriksaan selesai", status: "success" },
    { time: "10:15", patient: "Siti Rahayu", action: "Menunggu obat", status: "warning" },
    { time: "09:45", patient: "Budi Santoso", action: "Terdaftar", status: "info" },
    { time: "09:20", patient: "Dewi Lestari", action: "Pembayaran lunas", status: "success" },
    { time: "09:00", patient: "Joko Susilo", action: "Pemeriksaan berlangsung", status: "warning" },
  ];

  const statusColors = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-primary/10 text-primary",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang, <span className="font-medium text-foreground">{user?.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-base">
                    <div className="text-sm font-medium text-muted-foreground w-16">
                      {activity.time}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.patient}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[activity.status as keyof typeof statusColors]}`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Statistik Mingguan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Pasien Terdaftar</span>
                    <span className="font-medium">142 / 200</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "71%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Resep Diproses</span>
                    <span className="font-medium">98 / 150</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Pembayaran</span>
                    <span className="font-medium">135 / 142</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: "95%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
