import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Activity, Award, Clock, Check, X } from "lucide-react";
import { User as UserType } from "@/types/user";
import { useWorkLogsForUser } from "@/hooks/workLog/useWorkLogsForUser";
import { useUpdateWorklogStatus } from "@/hooks/workLog/useUpdateWorklogStatus";
import { useToast } from "@/hooks/use-toast";

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: UserType | null;
}

const ViewProfileModal: React.FC<ViewProfileModalProps> = ({
  isOpen,
  onClose,
  volunteer
}) => {
  const { toast } = useToast();
  const { data: worklog = [] } = useWorkLogsForUser(volunteer?.id, isOpen);
  const updateStatus = useUpdateWorklogStatus();
  const totalHours = worklog.reduce((sum, entry) => sum + (entry.hours || 0), 0);

  if (!volunteer) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast({ title: status === "approved" ? "Hours approved" : "Hours rejected" });
    } catch {
      toast({ title: "Error", description: "Could not update the entry.", variant: "destructive" });
    }
  };

  const statusVariant = (status?: string) =>
    status === 'approved' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary';

  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'coordinator': return 'bg-primary text-primary-foreground';
      case 'volunteer': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Volunteer Profile</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                {volunteer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{volunteer.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{volunteer.email}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getRoleColor(volunteer.role)}>
                  {volunteer.role || 'Volunteer'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-foreground">{formatDate(volunteer.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-foreground capitalize">{volunteer.role || 'Volunteer'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-soft-green" />
                  <span>Assigned Activities</span>
                </div>
                <Badge variant="outline">
                  {volunteer.volunteerActivities?.length || 0} Activities
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {volunteer.volunteerActivities && volunteer.volunteerActivities.length > 0 ? (
                <div className="space-y-3">
                  {volunteer.volunteerActivities.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{activity.title}</h4>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No activities assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Volunteer Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-warm-accent" />
                <span>Volunteer Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {worklog.length > 0 ? (
                <div className="space-y-3">
                  {worklog.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">
                            {entry.hours} {entry.hours === 1 ? 'hour' : 'hours'} - {formatDate(entry.weekStart)}
                          </span>
                          <Badge variant={statusVariant(entry.status)}>
                            {entry.status || 'pending'}
                          </Badge>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                        )}
                      </div>
                      {entry.status === 'pending' && (
                        <div className="flex items-center space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-soft-green hover:text-soft-green"
                            disabled={updateStatus.isPending}
                            onClick={() => handleReview(entry.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={updateStatus.isPending}
                            onClick={() => handleReview(entry.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No hours logged yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-warm-accent" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalHours}</p>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{volunteer.volunteerActivities?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Events Joined</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Activity className="h-8 w-8 text-soft-green" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{volunteer.volunteerActivities?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Active Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProfileModal;