import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/dashboard/useDashboardStats";
import { useAuth } from "@/contexts/AuthContext";
import { isVolunteer } from "@/config/permissions";

export const DashboardHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats } = useDashboardStats();

  // Los COORDINATOR gestionan actividades en /activities; los VOLUNTEER solo
  // pueden ver las suyas en su perfil (no hay una pantalla de "unirse" todavía).
  const activitiesDestination = isVolunteer(user?.role) ? "/profile" : "/activities";

  return (
    <div className="bg-gradient-soft py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to VoluntALIA Volunteer Portal
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Empowering communities through organized volunteer efforts.
            Track your impact, connect with others, and make a difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-primary hover:shadow-hover transition-smooth" onClick={() => navigate(activitiesDestination)}>
              <Plus className="h-5 w-5 mr-2" />
              View Activities
            </Button>
            <Button variant="outline" size="lg" className="shadow-soft" onClick={() => navigate("/hours")}>
              <Calendar className="h-5 w-5 mr-2" />
              My Hours
            </Button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-card shadow-card hover:shadow-hover transition-smooth">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-soft-blue/10 rounded-lg">
                <Users className="h-6 w-6 text-soft-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volunteers</p>
                <p className="text-2xl font-bold text-foreground">{stats?.totalVolunteers || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card hover:shadow-hover transition-smooth">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-soft-green/10 rounded-lg">
                <Calendar className="h-6 w-6 text-soft-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                <p className="text-2xl font-bold text-foreground">{stats?.activeActivities || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card hover:shadow-hover transition-smooth">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-warm-accent/20 rounded-lg">
                <Plus className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hours This Month</p>
                <p className="text-2xl font-bold text-foreground">{stats?.hoursThisMonth || 0}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};