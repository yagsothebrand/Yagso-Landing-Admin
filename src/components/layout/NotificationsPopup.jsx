"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";

export function NotificationPopup() {
  const { notifications, dismissNotification } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    const activeNotifications = notifications.filter((n) => !n.dismissed);

    activeNotifications.forEach((notification) => {
      if (!visibleNotifications.includes(notification.id)) {
        setVisibleNotifications((prev) => [...prev, notification.id]);

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
          dismissNotification(notification.id);
          setVisibleNotifications((prev) =>
            prev.filter((id) => id !== notification.id)
          );
        }, 10000);
      }
    });
  }, [notifications, dismissNotification, visibleNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case "out-of-stock":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "low-stock":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const activeNotifications = notifications.filter(
    (n) => !n.dismissed && visibleNotifications.includes(n.id)
  );

  if (activeNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {activeNotifications.map((notification) => (
        <Card
          key={notification.id}
          className="shadow-lg border-l-4 border-l-orange-500"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  dismissNotification(notification.id);
                  setVisibleNotifications((prev) =>
                    prev.filter((id) => id !== notification.id)
                  );
                }}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
