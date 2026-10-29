"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import {
  Bell,
  BellRing,
  CheckCheck,
  CheckSquare,
  Zap,
  Search,
  CheckCircle2,
  Pencil,
  Trash2,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import styles from "./NotificationCenter.module.css";
import {
  PortalNotification,
  formatNotificationTime,
  markNotificationRead,
  markNotificationUnread,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/lib/notifications";

export function NotificationCenter() {
  const { user, role } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [allNotifications, setAllNotifications] = useState<PortalNotification[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Real-time listener for notifications
  useEffect(() => {
    if (!user) return;

    // Listen to notifications ordered by createdAt desc
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(60)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userEmail = (user.email || "").toLowerCase().trim();
        const list: PortalNotification[] = [];

        snapshot.docs.forEach((d) => {
          const data = d.data();
          const target = String(data.recipientEmail || "").toLowerCase().trim();

          // Member sees: notifications targeted to their email OR open "GENERAL" broadcasts
          const isTargetedToMe = target === userEmail;
          const isGeneral = target === "general";
          const isAdminView = role === "admin" && data.type === "task_review";

          if (isTargetedToMe || isGeneral || isAdminView) {
            list.push({
              id: d.id,
              recipientEmail: data.recipientEmail || "",
              recipientName: data.recipientName || undefined,
              userId: data.userId || undefined,
              title: data.title || "Notification",
              message: data.message || "",
              type: data.type || "task_assigned",
              link: data.link || "/dashboard/tasks",
              read: !!data.read,
              createdAt: data.createdAt,
              senderEmail: data.senderEmail || undefined,
              senderName: data.senderName || undefined,
              metadata: data.metadata || {},
            });
          }
        });

        setAllNotifications(list);
      },
      (error) => {
        console.error("Error subscribing to notifications:", error);
      }
    );

    return () => unsubscribe();
  }, [user, role]);

  // Close popover when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const unreadNotifications = useMemo(
    () => allNotifications.filter((n) => !n.read),
    [allNotifications]
  );

  const displayedNotifications = useMemo(() => {
    if (filter === "unread") {
      return unreadNotifications;
    }
    return allNotifications;
  }, [filter, allNotifications, unreadNotifications]);

  const unreadCount = unreadNotifications.length;

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const unreadIds = unreadNotifications.map((n) => n.id);
    if (unreadIds.length > 0) {
      await markAllNotificationsRead(unreadIds);
    }
  };

  const handleItemClick = async (notification: PortalNotification) => {
    if (!notification.read) {
      await markNotificationRead(notification.id);
    }
    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleToggleRead = async (
    e: React.MouseEvent,
    notification: PortalNotification
  ) => {
    e.stopPropagation();
    if (notification.read) {
      await markNotificationUnread(notification.id);
    } else {
      await markNotificationRead(notification.id);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  const handleClearRead = async () => {
    const readIds = allNotifications.filter((n) => n.read).map((n) => n.id);
    if (readIds.length > 0) {
      await clearAllNotifications(readIds);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "task_assigned":
        return (
          <div
            className={styles.iconBox}
            style={{ background: "rgba(132, 36, 58, 0.12)", color: "#84243a" }}
          >
            <CheckSquare size={17} />
          </div>
        );
      case "task_stage_change":
        return (
          <div
            className={styles.iconBox}
            style={{ background: "rgba(156, 111, 24, 0.14)", color: "#9c6f18" }}
          >
            <Zap size={17} />
          </div>
        );
      case "task_review":
        return (
          <div
            className={styles.iconBox}
            style={{ background: "rgba(6, 182, 212, 0.14)", color: "#0891b2" }}
          >
            <Search size={17} />
          </div>
        );
      case "task_completed":
        return (
          <div
            className={styles.iconBox}
            style={{ background: "rgba(16, 185, 129, 0.14)", color: "#10b981" }}
          >
            <CheckCircle2 size={17} />
          </div>
        );
      case "task_updated":
        return (
          <div
            className={styles.iconBox}
            style={{ background: "rgba(139, 92, 246, 0.14)", color: "#7c3aed" }}
          >
            <Pencil size={16} />
          </div>
        );
      default:
        return (
          <div
            className={styles.iconBox}
            style={{ background: "rgba(156, 111, 24, 0.12)", color: "#9c6f18" }}
          >
            <Sparkles size={17} />
          </div>
        );
    }
  };

  if (!user) return null;

  return (
    <div className={styles.notificationWrapper}>
      <button
        onClick={handleToggle}
        className={`${styles.bellBtn} ${isOpen ? styles.bellBtnActive : ""}`}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
        title={unreadCount > 0 ? `${unreadCount} unread notification(s)` : "Notifications"}
      >
        {unreadCount > 0 ? <BellRing size={18} /> : <Bell size={18} />}
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />

          <div
            ref={popoverRef}
            className={styles.popover}
            role="dialog"
            aria-label="Member Notifications"
          >
            {/* Header */}
            <div className={styles.popoverHeader}>
              <div className={styles.headerTop}>
                <div className={styles.headerTitleGroup}>
                  <h3 className={styles.headerTitle}>Notifications</h3>
                  {unreadCount > 0 && (
                    <span className={styles.unreadTag}>
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className={styles.markAllBtn}
                    title="Mark all notifications as read"
                  >
                    <CheckCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className={styles.filterTabs}>
                <button
                  onClick={() => setFilter("all")}
                  className={`${styles.tabBtn} ${
                    filter === "all" ? styles.tabBtnActive : ""
                  }`}
                >
                  All ({allNotifications.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`${styles.tabBtn} ${
                    filter === "unread" ? styles.tabBtnActive : ""
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {/* List */}
            <div className={styles.listContainer}>
              {displayedNotifications.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <Bell size={24} />
                  </div>
                  <div className={styles.emptyTitle}>
                    {filter === "unread"
                      ? "No unread notifications"
                      : "No notifications yet"}
                  </div>
                  <p className={styles.emptySubtitle}>
                    {filter === "unread"
                      ? "You are all caught up with your tasks and sprint updates."
                      : "When you receive a new task or update, it will appear here."}
                  </p>
                </div>
              ) : (
                displayedNotifications.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.notificationItem} ${
                      !item.read ? styles.notificationUnread : ""
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    {getIconForType(item.type)}

                    <div className={styles.contentBox}>
                      <div className={styles.itemHeader}>
                        <div className={styles.itemTitle}>{item.title}</div>
                        <span className={styles.itemTime}>
                          {formatNotificationTime(item.createdAt)}
                        </span>
                      </div>

                      <p className={styles.itemMessage}>{item.message}</p>

                      <div className={styles.actionsRow}>
                        <button
                          onClick={(e) => handleToggleRead(e, item)}
                          className={styles.itemActionBtn}
                          title={item.read ? "Mark as unread" : "Mark as read"}
                        >
                          <CheckCheck size={12} />
                          {item.read ? "Mark unread" : "Mark read"}
                        </button>

                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className={`${styles.itemActionBtn} ${styles.itemActionBtnDanger}`}
                          title="Delete notification"
                        >
                          <Trash2 size={12} />
                          Dismiss
                        </button>
                      </div>
                    </div>

                    {!item.read && <span className={styles.unreadDot} />}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className={styles.popoverFooter}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/dashboard/tasks");
                }}
                className={styles.footerLink}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Sprint Board &rarr;
              </button>

              {allNotifications.some((n) => n.read) && (
                <button onClick={handleClearRead} className={styles.clearReadBtn}>
                  Clear read
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
