import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { azureApi } from "@/lib/azure-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  X, 
  Calendar, 
  Users, 
  MessageSquare, 
  Heart,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'action_reminder' | 'new_action' | 'message';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_id?: string;
  metadata?: any;
}

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSystem = ({ isOpen, onClose }: NotificationSystemProps) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  // Mock notification fetching - replace with real API call
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'new_action',
          title: 'New Civic Action in Your Area',
          message: 'Boston City Council Meeting scheduled for next week. Your interests: Government, Local Politics.',
          read: false,
          created_at: new Date().toISOString(),
          action_id: 'action-1'
        },
        {
          id: '2',
          type: 'action_reminder',
          title: 'Upcoming Event Reminder',
          message: 'Climate Action Committee meeting is tomorrow at 6:30 PM. Don\'t forget to bring your notes!',
          read: false,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          action_id: 'action-2'
        },
        {
          id: '3',
          type: 'success',
          title: 'Profile Updated',
          message: 'Your civic interests have been successfully updated. You\'ll now receive more relevant recommendations.',
          read: true,
          created_at: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: '4',
          type: 'message',
          title: 'New Message from Organizer',
          message: 'Sarah from Boston Parks Alliance sent you a message about the community garden project.',
          read: false,
          created_at: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: '5',
          type: 'info',
          title: 'Weekly Impact Summary',
          message: 'Great week! You participated in 2 actions and contributed 4 hours to your community.',
          read: true,
          created_at: new Date(Date.now() - 604800000).toISOString()
        }
      ];

      setNotifications(mockNotifications);
    } catch (error: any) {
      toast.error('Error loading notifications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      
      // Here you would make an API call to mark as read
      toast.success('Notification marked as read');
    } catch (error: any) {
      toast.error('Error updating notification: ' + error.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      // Here you would make an API call to mark all as read
      toast.success('All notifications marked as read');
    } catch (error: any) {
      toast.error('Error updating notifications: ' + error.message);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      
      // Here you would make an API call to delete
      toast.success('Notification deleted');
    } catch (error: any) {
      toast.error('Error deleting notification: ' + error.message);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'action_reminder':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'new_action':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-primary" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end pt-16 pr-4">
      <Card className="w-96 max-h-[80vh] bg-background border shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Bell className="w-5 h-5 mr-2 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="w-fit text-xs"
            >
              Mark all as read
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh]">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You'll see updates about civic actions and community activities here.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div 
                      className={`p-4 hover:bg-muted/50 transition-colors ${
                        !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getNotificationIcon(notification.type)}
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                        
                        {notification.action_id && (
                          <Button variant="outline" size="sm" className="text-xs h-6">
                            View Action
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystem;