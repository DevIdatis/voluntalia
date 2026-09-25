import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ArrowRight, CheckCircle } from "lucide-react";
import { useActivities } from "@/hooks/activity/useActivities";
import { useWorkLog } from "@/hooks/workLog/useWorkLog";
import { useAuth } from "@/contexts/AuthContext";
import { isVolunteer } from "@/config/permissions";
import { formatDate } from "@/lib/formatDate";

export const DashboardContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: activities = [] } = useActivities();
  const { data: worklog = [] } = useWorkLog();

  // Página de "gestionar/ver actividades" según el rol: los COORDINATOR administran
  // actividades en /activities; los VOLUNTEER solo pueden ver las suyas en su perfil.
  const activitiesDestination = isVolunteer(user?.role) ? "/profile" : "/activities";

  const upcomingActivities = activities
    .filter((a) => a.date && new Date(a.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date as Date).getTime() - new Date(b.date as Date).getTime())
    .slice(0, 3);

  const recentWorklog = [...worklog]
    .sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Upcoming Activities */}
        <Card className="shadow-card hover:shadow-hover transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-soft-blue" />
              <span>Upcoming Activities</span>
            </CardTitle>
            <CardDescription>
              Activities coming up that you can be part of
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming activities scheduled.</p>
            ) : (
              upcomingActivities.map((activity) => (
                <div key={activity.id} className="p-4 bg-gradient-soft rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-foreground">{activity.title}</h4>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(activity.date, { format: "medium" })}</span>
                    </div>
                    {activity.description && (
                      <p>{activity.description}</p>
                    )}
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{activity.volunteers?.length ?? 0} volunteers signed up</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card hover:shadow-hover transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-soft-green" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Your latest logged volunteer hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWorklog.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hours logged yet.</p>
            ) : (
              recentWorklog.map((entry) => (
                <div key={entry.id} className="p-4 bg-gradient-soft rounded-lg border border-border">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">Logged</Badge>
                        <span className="font-medium text-foreground">
                          {entry.activityTitle || entry.activity?.title || entry.notes}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(entry.weekStart)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-soft-green">+{entry.hours ?? 0}h</p>
                      <p className="text-xs text-muted-foreground">volunteer hours</p>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Quick Actions */}
            <div className="pt-4 border-t border-border">
              <h5 className="font-medium text-foreground mb-3">Quick Actions</h5>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="shadow-soft" onClick={() => navigate(activitiesDestination)}>
                  View Activities
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <Button variant="outline" size="sm" className="shadow-soft" onClick={() => navigate("/hours")}>
                  My Hours
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
