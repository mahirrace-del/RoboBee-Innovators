"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./bom.module.css";
import { STANDARD_INVENTORY_CATEGORIES } from "@/lib/portalRelations";
import {
  Pencil,
  Trash2,
  Send,
  Plus,
  X,
  Package,
  Calendar,
  Layers,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  ShoppingBag,
  RefreshCw,
  FileDown,
} from "lucide-react";
import { generateProcurementPDF, ProcurementItem } from "@/lib/procurementPdf";

interface BOMItem {
  id: string;
  itemId?: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  totalCost: number;
  source: string;
  status: "Needed" | "Requested" | "Approved" | "In Stock" | "Cancelled" | string;
  expectedArrivalDate?: string;
}

export interface ProjectDoc {
  id: string;
  name: string;
  title?: string;
  bom?: BOMItem[];
  bomType?: "store_admin" | "task_member";
  taskId?: string | null;
  taskTitle?: string | null;
  studentName?: string | null;
  schoolName?: string | null;
  classGrade?: string | null;
  createdBy?: string;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Bangladesh Robotics Presets with standard local market pricing (BDT)
const BD_ROBOTICS_PRESETS = [
  { name: "Arduino Uno R3 (CH340)", category: "Microcontrollers", price: 600, source: "RoboShop BD" },
  { name: "Arduino Nano Type-C", category: "Microcontrollers", price: 350, source: "TechShop BD" },
  { name: "ESP32 NodeMCU (WiFi+BT)", category: "Microcontrollers", price: 550, source: "RoboShop BD" },
  { name: "HC-SR04 Ultrasonic Sensor", category: "Sensors", price: 100, source: "RoboShop BD" },
  { name: "SG90 Micro Servo 9g", category: "Motors & Actuators", price: 140, source: "TechShop BD" },
  { name: "MG996R Metal Gear Servo", category: "Motors & Actuators", price: 500, source: "RoboShop BD" },
  { name: "BO Gear Motor + Rubber Wheel (Pair)", category: "Motors & Actuators", price: 220, source: "Local Market" },
  { name: "L298N Dual Motor Driver", category: "Power & Drivers", price: 200, source: "TechShop BD" },
  { name: "6V Mini USB Submersible Water Pump", category: "Motors & Actuators", price: 150, source: "Local Market" },
  { name: "Small Solar Panel 5V/6V", category: "Power & Drivers", price: 220, source: "Daraz" },
  { name: "18650 Li-ion Batteries (2x) + Holder", category: "Power & Drivers", price: 400, source: "Local Market" },
  { name: "400-Pt Breadboard + 40-pc Jumpers", category: "Prototyping", price: 180, source: "TechShop BD" },
  { name: "IR Obstacle / Tracking Sensor Module", category: "Sensors", price: 60, source: "RoboShop BD" },
  { name: "Soil Moisture Sensor Module", category: "Sensors", price: 90, source: "TechShop BD" },
  { name: "MQ-2 Gas / Smoke Sensor Module", category: "Sensors", price: 140, source: "RoboShop BD" },
];

function BOMDashboardContent() {
  const { user, role } = useAuth();
  const searchParams = useSearchParams();

  // Two BOM Modes:
  // 1. "task_member": Task & Science Project BOMs created by members for tasks & school projects
  // 2. "store_admin": Master Lab / Store BOM connected to store inventory & admin procurement
  const queryMode = searchParams.get("mode");
  const [bomViewMode, setBomViewMode] = useState<"task_member" | "store_admin">(() => {
    if (queryMode === "store" || queryMode === "store_admin") return "store_admin";
    if (queryMode === "task" || queryMode === "task_member") return "task_member";
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("robobee_last_bom_view_mode");
      if (saved === "store_admin" || saved === "task_member") return saved;
    }
    return "task_member";
  });

  const handleSwitchBOMMode = (mode: "task_member" | "store_admin") => {
    setBomViewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("robobee_last_bom_view_mode", mode);
    }
  };

  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    const qProjectId = searchParams.get("projectId");
    if (qProjectId) return qProjectId;
    if (typeof window !== "undefined") {
      return localStorage.getItem("robobee_last_selected_bom_project") || "";
    }
    return "";
  });

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    if (typeof window !== "undefined") {
      localStorage.setItem("robobee_last_selected_bom_project", projectId);
    }
  };

  // New Project Form
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectTaskId, setNewProjectTaskId] = useState("");
  const [isProjectCreateOpen, setIsProjectCreateOpen] = useState(false);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isSyncingTask, setIsSyncingTask] = useState(false);

  // Add Item to BOM Form
  const [addMode, setAddMode] = useState<"custom" | "inventory">("custom");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("Microcontrollers");
  const [customPrice, setCustomPrice] = useState(0);
  const [customSource, setCustomSource] = useState("RoboShop BD");
  const [quantity, setQuantity] = useState(1);

  // Edit Item Modal State
  const [editingItem, setEditingItem] = useState<BOMItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Microcontrollers");
  const [editSource, setEditSource] = useState("Daraz");
  const [editPrice, setEditPrice] = useState(0);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editStatus, setEditStatus] = useState("Needed");

  // Requisition Modal State
  const [isRequisitionOpen, setIsRequisitionOpen] = useState(false);
  const [requisitionNotes, setRequisitionNotes] = useState("");
  const [isSubmittingRequisition, setIsSubmittingRequisition] = useState(false);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Listen to Projects & Inventory in Firestore
  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setProjects(items);

      // Check URL query parameters for preferred project or task, fallback to localStorage
      const qProjectId = searchParams.get("projectId");
      const qTaskId = searchParams.get("taskId");
      const savedProjectId =
        typeof window !== "undefined"
          ? localStorage.getItem("robobee_last_selected_bom_project")
          : null;

      if (qProjectId && items.some((p) => p.id === qProjectId)) {
        handleSelectProject(qProjectId);
      } else if (qTaskId) {
        const matchingProject = items.find((p) => p.taskId === qTaskId);
        if (matchingProject) {
          handleSelectProject(matchingProject.id);
        } else if (savedProjectId && items.some((p) => p.id === savedProjectId)) {
          handleSelectProject(savedProjectId);
        } else if (items.length > 0 && !selectedProjectId) {
          handleSelectProject(items[0].id);
        }
      } else if (savedProjectId && items.some((p) => p.id === savedProjectId)) {
        handleSelectProject(savedProjectId);
      } else if (items.length > 0 && !selectedProjectId) {
        handleSelectProject(items[0].id);
      }
    });

    const unsubInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
        price: (d.data() as any).price || 150,
      }));
      setInventory(items);
    });

    return () => {
      unsubProjects();
      unsubInventory();
    };
  }, [searchParams]);

  // 2. Fetch Tasks from Supabase for linking
  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("id, title, student_name, school_name, class_grade, budget_bdt, attachments, stage, status")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setTasks(data);

          // If URL had taskId and no matching project exists, pre-fill form
          const qTaskId = searchParams.get("taskId");
          const qTaskTitle = searchParams.get("taskTitle");
          if (qTaskId) {
            const foundTask = data.find((t) => t.id === qTaskId);
            if (foundTask) {
              setNewProjectTaskId(foundTask.id);
              setNewProjectName(foundTask.title);
              setBomViewMode("task_member");
            } else if (qTaskTitle) {
              setNewProjectTaskId(qTaskId);
              setNewProjectName(decodeURIComponent(qTaskTitle));
              setBomViewMode("task_member");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load tasks for BOM linking:", err);
      }
    }
    fetchTasks();
  }, [searchParams]);

  // Filtered projects based on active BOM View Mode
  const filteredProjects = useMemo(() => {
    if (bomViewMode === "store_admin") {
      // Show store/admin projects (or those without a specific taskId)
      return projects.filter((p) => p.bomType !== "task_member" || !p.taskId);
    } else {
      // Show task & member projects
      return projects.filter((p) => p.bomType === "task_member" || p.taskId || p.bomType !== "store_admin");
    }
  }, [projects, bomViewMode]);

  // Ensure selectedProjectId points to a valid project in current mode
  useEffect(() => {
    if (filteredProjects.length > 0) {
      if (!filteredProjects.some((p) => p.id === selectedProjectId)) {
        setSelectedProjectId(filteredProjects[0].id);
      }
    }
  }, [filteredProjects, selectedProjectId]);

  const activeProject = projects.find((p) => p.id === selectedProjectId);
  const activeLinkedTask = useMemo(() => {
    if (!activeProject?.taskId) return null;
    return tasks.find((t) => t.id === activeProject.taskId) || null;
  }, [activeProject, tasks]);

  // Calculate costs
  const totalProjectCost = useMemo(() => {
    return activeProject?.bom?.reduce((acc: number, item: any) => acc + (Number(item.totalCost) || 0), 0) || 0;
  }, [activeProject]);

  const neededCost = useMemo(() => {
    return (
      activeProject?.bom
        ?.filter((b: any) => b.status !== "In Stock")
        ?.reduce((acc: number, item: any) => acc + (Number(item.totalCost) || 0), 0) || 0
    );
  }, [activeProject]);

  const neededItems = useMemo(() => {
    if (!activeProject?.bom) return [];
    return activeProject.bom.filter(
      (b: BOMItem) => b.status === "Needed" && b.source !== "Lab Inventory"
    );
  }, [activeProject]);

  // 3. Create Project Handler (Allowed for ALL authenticated members)
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      showToast("Please enter a project name.", "error");
      return;
    }

    setIsCreatingProject(true);
    try {
      let linkedTaskInfo: any = null;
      if (newProjectTaskId) {
        linkedTaskInfo = tasks.find((t) => t.id === newProjectTaskId) || null;
      }

      const docRef = await addDoc(collection(db, "projects"), {
        name: newProjectName.trim(),
        title: newProjectName.trim(),
        bom: [],
        bomType: bomViewMode,
        taskId: linkedTaskInfo?.id || newProjectTaskId || null,
        taskTitle: linkedTaskInfo?.title || null,
        studentName: linkedTaskInfo?.student_name || null,
        schoolName: linkedTaskInfo?.school_name || null,
        classGrade: linkedTaskInfo?.class_grade || null,
        createdBy: user?.email || "Team Member",
        createdByName: user?.displayName || user?.email?.split("@")[0] || "Team Member",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setNewProjectName("");
      setNewProjectTaskId("");
      handleSelectProject(docRef.id);
      setIsProjectCreateOpen(false);
      showToast(`Created project "${newProjectName.trim()}" successfully!`);
    } catch (err: any) {
      console.error("Error creating project:", err);
      showToast(`Failed to create project: ${err.message || "Permission error"}`, "error");
    } finally {
      setIsCreatingProject(false);
    }
  };

  // 4. Attach & Sync BOM directly to Task in Supabase & Firestore
  const handleSyncBOMToTask = async (customTaskId?: string) => {
    const targetTaskId = customTaskId || activeProject?.taskId;
    if (!targetTaskId || !activeProject) {
      showToast("Please select a task to link this BOM with.", "error");
      return;
    }

    setIsSyncingTask(true);
    try {
      const currentBOM: BOMItem[] = Array.isArray(activeProject.bom) ? [...activeProject.bom] : [];
      const computedTotal = currentBOM.reduce((acc, it) => acc + (Number(it.totalCost) || 0), 0);

      // Fetch latest task record from Supabase
      const { data: currentTask, error: fetchErr } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", targetTaskId)
        .single();

      if (fetchErr || !currentTask) {
        throw new Error("Target task not found in database.");
      }

      const bomAttachment = {
        type: "project_bom",
        projectId: activeProject.id,
        projectName: activeProject.name,
        totalCost: computedTotal,
        itemsCount: currentBOM.length,
        items: currentBOM.map((i) => ({
          name: i.name,
          category: i.category || "General",
          quantity: i.quantity,
          price: i.price,
          totalCost: i.totalCost,
          source: i.source,
          status: i.status,
        })),
        syncedAt: new Date().toISOString(),
        syncedBy: user?.displayName || user?.email || "Team Member",
      };

      // Filter out any older BOM attachment for this task and attach new one
      const rawAttachments = Array.isArray(currentTask.attachments) ? currentTask.attachments : [];
      const updatedAttachments = [
        ...rawAttachments.filter((a: any) => a?.type !== "project_bom"),
        bomAttachment,
      ];

      // Update Supabase task record
      const { error: updateErr } = await supabase
        .from("tasks")
        .update({
          budget_bdt: computedTotal,
          attachments: updatedAttachments,
        })
        .eq("id", targetTaskId);

      if (updateErr) {
        console.warn("Supabase task budget update warning:", updateErr);
      }

      // Update Firestore task record if mirrored
      try {
        await updateDoc(doc(db, "tasks", targetTaskId), {
          budget_bdt: computedTotal,
          attachments: updatedAttachments,
        });
      } catch {}

      // Update Firestore project doc with taskId link
      await updateDoc(doc(db, "projects", activeProject.id), {
        taskId: targetTaskId,
        taskTitle: currentTask.title,
        studentName: currentTask.student_name,
        classGrade: currentTask.class_grade,
        bomType: "task_member",
        updatedAt: new Date().toISOString(),
      });

      // Update local task state
      setTasks((prev) =>
        prev.map((t) =>
          t.id === targetTaskId ? { ...t, budget_bdt: computedTotal, attachments: updatedAttachments } : t
        )
      );

      showToast(`Attached BOM (৳${computedTotal.toLocaleString()} BDT) to Task "${currentTask.title}"!`);
    } catch (err: any) {
      console.error("Error syncing BOM to task:", err);
      showToast(`Sync error: ${err.message || "Failed to attach"}`, "error");
    } finally {
      setIsSyncingTask(false);
    }
  };

  // 5. Add Item to BOM (Atomic, fresh-fetching, optimistic state update)
  const handleAddItemToBOM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || quantity < 1 || !activeProject) return;

    let newItem: BOMItem | null = null;

    if (addMode === "inventory") {
      const item = inventory.find((i) => i.id === selectedItemId);
      if (!item) {
        showToast("Please choose an inventory item.", "error");
        return;
      }
      newItem = {
        id: `bom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        itemId: item.id,
        name: item.name,
        category: item.category || "General",
        price: Number(item.price) || 0,
        quantity: Number(quantity) || 1,
        totalCost: (Number(item.price) || 0) * (Number(quantity) || 1),
        source: "Lab Inventory",
        status: "In Stock",
      };
    } else {
      if (!customName.trim()) {
        showToast("Please enter a component name.", "error");
        return;
      }
      newItem = {
        id: `bom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: customName.trim(),
        category: customCategory || "General",
        price: Number(customPrice) || 0,
        quantity: Number(quantity) || 1,
        totalCost: (Number(customPrice) || 0) * (Number(quantity) || 1),
        source: customSource,
        status: "Needed",
      };
    }

    try {
      const projRef = doc(db, "projects", selectedProjectId);
      const projSnap = await getDoc(projRef);

      // Fetch fresh BOM from server to avoid overwriting previously added components
      const freshBOM: BOMItem[] =
        projSnap.exists() && Array.isArray(projSnap.data().bom)
          ? [...projSnap.data().bom]
          : Array.isArray(activeProject.bom)
          ? [...activeProject.bom]
          : [];

      // Append new item ensuring no duplicates by id
      const updatedBOM = [...freshBOM.filter((it) => it.id !== newItem.id), newItem];
      const nowIso = new Date().toISOString();

      await updateDoc(projRef, {
        bom: updatedBOM,
        updatedAt: nowIso,
      });

      // Optimistically update React state immediately so subsequent clicks don't race
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProjectId ? { ...p, bom: updatedBOM, updatedAt: nowIso } : p
        )
      );

      // Auto-sync to linked task (both budget_bdt and full itemized attachments)
      const targetTaskId = activeProject.taskId || (projSnap.exists() ? projSnap.data().taskId : null);
      if (targetTaskId) {
        const total = updatedBOM.reduce((acc, it) => acc + (Number(it.totalCost) || 0), 0);

        supabase
          .from("tasks")
          .select("attachments")
          .eq("id", targetTaskId)
          .single()
          .then(({ data: taskData }) => {
            const rawAttachments = Array.isArray(taskData?.attachments) ? taskData.attachments : [];
            const newBomAttachment = {
              type: "project_bom",
              projectId: selectedProjectId,
              projectName: activeProject.name || (projSnap.exists() ? projSnap.data().name : "Project"),
              totalCost: total,
              itemsCount: updatedBOM.length,
              items: updatedBOM.map((i) => ({
                name: i.name,
                category: i.category || "General",
                quantity: i.quantity,
                price: i.price,
                totalCost: i.totalCost,
                source: i.source,
                status: i.status,
              })),
              syncedAt: nowIso,
              syncedBy: user?.displayName || user?.email || "Team Member",
            };

            const updatedAttachments = [
              ...rawAttachments.filter((a: any) => a?.type !== "project_bom"),
              newBomAttachment,
            ];

            supabase
              .from("tasks")
              .update({ budget_bdt: total, attachments: updatedAttachments })
              .eq("id", targetTaskId)
              .then(() => {}, () => {});
          }, () => {});
      }

      showToast(`Added "${newItem.name}" to BOM!`);

      // Reset item form
      setCustomName("");
      setCustomPrice(0);
      setSelectedItemId("");
      setQuantity(1);
      setIsItemFormOpen(false);
    } catch (err: any) {
      console.error("Error adding item to BOM:", err);
      showToast(`Failed to add item: ${err.message || "Permission error"}`, "error");
    }
  };

  // Quick Preset Selection
  const handleApplyPreset = (preset: (typeof BD_ROBOTICS_PRESETS)[0]) => {
    setAddMode("custom");
    setCustomName(preset.name);
    setCustomCategory(preset.category);
    setCustomPrice(preset.price);
    setCustomSource(preset.source);
    setIsItemFormOpen(true);
  };

  // 6. Edit & Save Item (Atomic with fresh document fetch)
  const handleOpenEdit = (item: BOMItem) => {
    setEditingItem(item);
    setEditName(item.name || "");
    setEditCategory(item.category || "Microcontrollers");
    setEditSource(item.source || "Daraz");
    setEditPrice(Number(item.price) || 0);
    setEditQuantity(Number(item.quantity) || 1);
    setEditStatus(item.status || "Needed");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !activeProject) return;

    try {
      const projRef = doc(db, "projects", selectedProjectId);
      const projSnap = await getDoc(projRef);

      const freshBOM: BOMItem[] =
        projSnap.exists() && Array.isArray(projSnap.data().bom)
          ? [...projSnap.data().bom]
          : Array.isArray(activeProject.bom)
          ? [...activeProject.bom]
          : [];

      const p = Number(editPrice) || 0;
      const q = Number(editQuantity) || 1;

      const updatedBOM = freshBOM.map((item) => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            name: editName.trim(),
            category: editCategory,
            source: editSource,
            price: p,
            quantity: q,
            totalCost: p * q,
            status: editStatus,
          };
        }
        return item;
      });

      const nowIso = new Date().toISOString();
      await updateDoc(projRef, {
        bom: updatedBOM,
        updatedAt: nowIso,
      });

      // Optimistically update React state
      setProjects((prev) =>
        prev.map((pr) =>
          pr.id === selectedProjectId ? { ...pr, bom: updatedBOM, updatedAt: nowIso } : pr
        )
      );

      // Auto-sync to task if linked
      const targetTaskId = activeProject.taskId || (projSnap.exists() ? projSnap.data().taskId : null);
      if (targetTaskId) {
        const total = updatedBOM.reduce((acc, it) => acc + (Number(it.totalCost) || 0), 0);
        supabase.from("tasks").update({ budget_bdt: total }).eq("id", targetTaskId).then(() => {}, () => {});
      }

      setEditingItem(null);
      showToast("BOM item updated!");
    } catch (err: any) {
      console.error("Error saving edit:", err);
      showToast(`Error updating item: ${err.message}`, "error");
    }
  };

  // 7. Delete Item (Atomic with fresh document fetch)
  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`Remove "${itemName}" from this project's BOM?`)) return;
    if (!activeProject) return;

    try {
      const projRef = doc(db, "projects", selectedProjectId);
      const projSnap = await getDoc(projRef);

      const freshBOM: BOMItem[] =
        projSnap.exists() && Array.isArray(projSnap.data().bom)
          ? [...projSnap.data().bom]
          : Array.isArray(activeProject.bom)
          ? [...activeProject.bom]
          : [];

      const updatedBOM = freshBOM.filter((item) => item.id !== itemId);
      const nowIso = new Date().toISOString();

      await updateDoc(projRef, {
        bom: updatedBOM,
        updatedAt: nowIso,
      });

      // Optimistically update React state
      setProjects((prev) =>
        prev.map((pr) =>
          pr.id === selectedProjectId ? { ...pr, bom: updatedBOM, updatedAt: nowIso } : pr
        )
      );

      // Auto-sync to task if linked
      const targetTaskId = activeProject.taskId || (projSnap.exists() ? projSnap.data().taskId : null);
      if (targetTaskId) {
        const total = updatedBOM.reduce((acc, it) => acc + (Number(it.totalCost) || 0), 0);
        supabase.from("tasks").update({ budget_bdt: total }).eq("id", targetTaskId).then(() => {}, () => {});
      }

      showToast(`Removed "${itemName}" from BOM.`);
    } catch (err: any) {
      console.error("Error removing item:", err);
      showToast(`Error deleting item: ${err.message}`, "error");
    }
  };

  // 8. Submit Requisition to Admin (Preserving fresh BOM items)
  const handleSubmitRequisition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || neededItems.length === 0) return;

    setIsSubmittingRequisition(true);
    try {
      const itemsToRequest = neededItems.map((item: BOMItem) => ({
        id: item.id || Date.now().toString(),
        name: item.name,
        category: item.category || "General",
        source: item.source || "Local Market",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        totalCost: (Number(item.price) || 0) * (Number(item.quantity) || 1),
        status: "Needed",
      }));

      const reqTotal = itemsToRequest.reduce((sum: number, i: any) => sum + i.totalCost, 0);

      await addDoc(collection(db, "partRequests"), {
        type: "bom_procurement",
        projectId: activeProject.id,
        projectName: activeProject.name,
        items: itemsToRequest,
        itemsCount: itemsToRequest.length,
        totalCost: reqTotal,
        notes: requisitionNotes.trim() || null,
        requestedBy: user?.displayName || user?.email || "Team Member",
        requestedByEmail: user?.email || "",
        requestedByUid: user?.uid || "",
        requestedAt: new Date().toISOString(),
        status: "pending",
      });

      const projRef = doc(db, "projects", activeProject.id);
      const projSnap = await getDoc(projRef);
      const freshBOM: BOMItem[] =
        projSnap.exists() && Array.isArray(projSnap.data().bom)
          ? [...projSnap.data().bom]
          : Array.isArray(activeProject.bom)
          ? [...activeProject.bom]
          : [];

      const updatedBOM = freshBOM.map((item) => {
        const isRequested = itemsToRequest.some(
          (reqItem: any) => reqItem.id === item.id || reqItem.name.toLowerCase() === item.name.toLowerCase()
        );
        if (isRequested) {
          return { ...item, status: "Requested" };
        }
        return item;
      });

      const nowIso = new Date().toISOString();
      await updateDoc(projRef, {
        bom: updatedBOM,
        updatedAt: nowIso,
      });

      setProjects((prev) =>
        prev.map((pr) =>
          pr.id === activeProject.id ? { ...pr, bom: updatedBOM, updatedAt: nowIso } : pr
        )
      );

      showToast(`Procurement requisition for ${itemsToRequest.length} part(s) submitted to Admin!`);
      setIsRequisitionOpen(false);
      setRequisitionNotes("");
    } catch (err: any) {
      console.error("Error submitting requisition:", err);
      showToast(`Failed to submit requisition: ${err.message || "Error"}`, "error");
    } finally {
      setIsSubmittingRequisition(false);
    }
  };

  // Download Store Procurement Slip for Active Project BOM (No estimated prices printed)
  const handleDownloadProjectPDF = async () => {
    if (!activeProject || !activeProject.bom || activeProject.bom.length === 0) {
      showToast("No components in this project BOM to export.", "error");
      return;
    }

    try {
      const items: ProcurementItem[] = activeProject.bom.map((b) => ({
        id: b.id,
        name: b.name,
        quantity: b.quantity || 1,
        category: b.category || "General",
        source: b.source || "Local Market",
        projectName: activeProject.name || activeProject.title || "RoboBee Project",
        notes: b.status === "In Stock" ? "In Stock" : undefined,
      }));

      await generateProcurementPDF({
        title: `${activeProject.name || activeProject.title} — Procurement Slip`,
        projectName: activeProject.name || activeProject.title || "Maker Lab Project",
        studentName: activeProject.studentName || undefined,
        classGrade: activeProject.classGrade || undefined,
        requestedBy: `${activeProject.createdByName || activeProject.createdBy || user?.displayName || "Mahir Rahman"}`,
        items,
      });

      showToast("Store procurement PDF downloaded successfully!");
    } catch (err: any) {
      console.error("Failed to generate project BOM PDF:", err);
      showToast(`Failed to generate PDF: ${err.message || "Error"}`, "error");
    }
  };

  const renderStatusBadge = (status: string, expectedArrivalDate?: string) => {
    if (status === "In Stock") {
      return (
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: 700,
            background: "rgba(16, 185, 129, 0.14)",
            color: "#065f46",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <CheckCircle size={12} />
          In Stock
        </span>
      );
    }

    if (status === "Requested") {
      return (
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: 700,
            background: "rgba(245, 158, 11, 0.14)",
            color: "#b45309",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <Clock size={12} />
          Requested (Pending Admin)
        </span>
      );
    }

    if (status === "Approved") {
      return (
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: 700,
            background: "rgba(37, 99, 235, 0.14)",
            color: "#1d4ed8",
            border: "1px solid rgba(37, 99, 235, 0.35)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <Calendar size={12} />
          Approved {expectedArrivalDate ? `• Arriving ${expectedArrivalDate}` : "• Order Placed"}
        </span>
      );
    }

    return (
      <span
        style={{
          padding: "0.25rem 0.75rem",
          borderRadius: "20px",
          fontSize: "0.78rem",
          fontWeight: 700,
          background: "rgba(239, 68, 68, 0.14)",
          color: "#dc2626",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
        }}
      >
        <AlertCircle size={12} />
        {status || "Needed"}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 9999,
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            background: toastMessage.type === "success" ? "#065f46" : "#b91c1c",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.86rem",
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {toastMessage.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1>Project Budgets & Bills of Material (BOM)</h1>
            <p>Plan robot builds, calculate part costing in BDT, and attach itemized bills directly to assigned tasks.</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link
              href="/dashboard/tasks"
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid #dfd7cc",
                background: "#fff",
                color: "#4a4039",
                fontSize: "0.8rem",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <span>View Tasks Board</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* Top Segmented Controls: Two BOM Options */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "1.25rem",
            borderBottom: "2px solid #e6dfd5",
            paddingBottom: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => handleSwitchBOMMode("task_member")}
            style={{
              padding: "0.55rem 1.15rem",
              borderRadius: "9px",
              fontWeight: 700,
              fontSize: "0.86rem",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              background: bomViewMode === "task_member" ? "#7A1C24" : "#f8f6f2",
              color: bomViewMode === "task_member" ? "#fff" : "#4a4039",
              border: bomViewMode === "task_member" ? "1px solid #7A1C24" : "1px solid #dfd7cc",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Layers size={16} />
            <span>Task & Science Project BOM</span>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "0.1rem 0.4rem",
                borderRadius: "10px",
                background: bomViewMode === "task_member" ? "rgba(255,255,255,0.25)" : "#e6dfd5",
              }}
            >
              For Members & Tasks
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchBOMMode("store_admin")}
            style={{
              padding: "0.55rem 1.15rem",
              borderRadius: "9px",
              fontWeight: 700,
              fontSize: "0.86rem",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              background: bomViewMode === "store_admin" ? "#7A1C24" : "#f8f6f2",
              color: bomViewMode === "store_admin" ? "#fff" : "#4a4039",
              border: bomViewMode === "store_admin" ? "1px solid #7A1C24" : "1px solid #dfd7cc",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Package size={16} />
            <span>Master Lab / Store BOM</span>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "0.1rem 0.4rem",
                borderRadius: "10px",
                background: bomViewMode === "store_admin" ? "rgba(255,255,255,0.25)" : "#e6dfd5",
              }}
            >
              Store & Admin Requisitions
            </span>
          </button>
        </div>
      </div>

      {/* Mode Sub-banner */}
      <div
        style={{
          marginBottom: "1rem",
          padding: "0.6rem 0.95rem",
          borderRadius: "8px",
          background: bomViewMode === "task_member" ? "#fef3c7" : "#ecfdf5",
          border: bomViewMode === "task_member" ? "1px solid #fde68a" : "1px solid #a7f3d0",
          fontSize: "0.82rem",
          color: bomViewMode === "task_member" ? "#92400e" : "#065f46",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {bomViewMode === "task_member" ? (
          <>
            <Layers size={15} />
            <span>
              <strong>Task & Science Project BOM Mode:</strong> Select or create a project bill, add components needed for the build, and attach it to the assigned Task so Mahir and mentors can review the bills upon completion.
            </span>
          </>
        ) : (
          <>
            <ShoppingBag size={15} />
            <span>
              <strong>Master Lab Store BOM Mode:</strong> Manage standard lab builds, track in-stock inventory vs new parts required, and dispatch procurement requisitions directly to Admin.
            </span>
          </>
        )}
      </div>

      {/* Project Selector & Creation Bar */}
      <div
        className={styles.panel}
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "260px" }}>
          <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.8rem", color: "#5c5149" }}>
            Select Project ({filteredProjects.length} available)
          </label>
          <select
            className={styles.select}
            value={selectedProjectId}
            onChange={(e) => handleSelectProject(e.target.value)}
          >
            {filteredProjects.length === 0 && <option value="">No projects in this category yet</option>}
            {filteredProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || p.title || "Untitled Project"} {p.taskId ? "• [Linked to Task]" : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={styles.btn}
          style={{ width: "auto" }}
          onClick={() => setIsProjectCreateOpen((open) => !open)}
          aria-expanded={isProjectCreateOpen}
        >
          <Plus size={15} />
          <span>{isProjectCreateOpen ? "Cancel" : "New Project BOM"}</span>
        </button>

        {/* Project Create Drawer / Inline Form */}
        {isProjectCreateOpen && (
          <form
            onSubmit={handleCreateProject}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              flex: "1 1 100%",
              background: "#fff",
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid #dfd7cc",
              marginTop: "0.5rem",
            }}
          >
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 700, fontSize: "0.78rem", color: "#5c5149" }}>
                  Project Name
                </label>
                <input
                  className={styles.input}
                  style={{ marginBottom: 0 }}
                  placeholder="e.g. Smart House with Rain Sensor & Street Light"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
              </div>

              {bomViewMode === "task_member" && (
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 700, fontSize: "0.78rem", color: "#5c5149" }}>
                    Link to Assigned Task (Optional)
                  </label>
                  <select
                    className={styles.select}
                    value={newProjectTaskId}
                    onChange={(e) => {
                      const tId = e.target.value;
                      setNewProjectTaskId(tId);
                      if (tId && !newProjectName.trim()) {
                        const t = tasks.find((item) => item.id === tId);
                        if (t) setNewProjectName(t.title);
                      }
                    }}
                  >
                    <option value="">-- Standalone Science Project --</option>
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} {t.student_name ? `(${t.student_name})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.4rem" }}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setIsProjectCreateOpen(false)}
                style={{ width: "auto" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.btn}
                style={{ width: "auto" }}
                disabled={isCreatingProject || !newProjectName.trim()}
              >
                {isCreatingProject ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        )}
      </div>

      {activeProject ? (
        <div className={styles.panels}>
          <div style={{ gridColumn: "span 2" }}>
            <div className={styles.panel}>
              {/* Linked Task Metadata Banner */}
              {activeProject.taskId ? (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    marginBottom: "1.25rem",
                    borderRadius: "10px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.6rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <LinkIcon size={16} color="#059669" />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#065f46" }}>
                        Linked to Task: {activeProject.taskTitle || activeLinkedTask?.title || "Assigned Task"}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#166534", marginTop: "0.15rem" }}>
                        {activeProject.studentName && <span>Student: <strong>{activeProject.studentName}</strong> • </span>}
                        {activeProject.classGrade && <span>Class: <strong>{activeProject.classGrade}</strong> • </span>}
                        {activeProject.schoolName && <span>School: <strong>{activeProject.schoolName}</strong> • </span>}
                        <span>Synced Budget: <strong>৳{totalProjectCost.toLocaleString()} BDT</strong></span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleSyncBOMToTask()}
                      disabled={isSyncingTask}
                      style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "7px",
                        background: "#059669",
                        color: "#fff",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                      title="Sync this BOM parts list and total BDT to the task"
                    >
                      <RefreshCw size={13} className={isSyncingTask ? "animate-spin" : ""} />
                      <span>{isSyncingTask ? "Syncing..." : "Sync to Task"}</span>
                    </button>

                    <Link
                      href="/dashboard/tasks"
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: "7px",
                        background: "#fff",
                        border: "1px solid #a7f3d0",
                        color: "#065f46",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <span>Open Task</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              ) : bomViewMode === "task_member" ? (
                <div
                  style={{
                    padding: "0.6rem 0.85rem",
                    marginBottom: "1.25rem",
                    borderRadius: "8px",
                    background: "#f8f6f2",
                    border: "1px dashed #d6cec2",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.6rem",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "#5c5149" }}>
                    This project is not currently attached to a task. You can link it to an assigned sprint task below:
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <select
                      className={styles.select}
                      style={{ padding: "0.3rem 0.5rem", fontSize: "0.78rem" }}
                      onChange={(e) => {
                        if (e.target.value) handleSyncBOMToTask(e.target.value);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>-- Link to a Task --</option>
                      {tasks.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} {t.student_name ? `(${t.student_name})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              {/* Title & Cost Summary */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h2 className={styles.sectionTitle} style={{ marginBottom: "0.25rem", color: "#27211d" }}>
                    {activeProject.name || activeProject.title} — Bill of Materials
                  </h2>
                  <div style={{ fontSize: "0.85rem", color: "#6f665e" }}>
                    {activeProject.bom?.length || 0} component(s) listed • Created by: {activeProject.createdBy || "Team"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "1.35rem",
                        fontWeight: "800",
                        color: "var(--brand-burgundy, #84243a)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Total Est: <span style={{ marginRight: "0.2rem" }}>৳</span>
                      {totalProjectCost.toLocaleString()} BDT
                    </div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        color: neededCost > 0 ? "#dc2626" : "#059669",
                        fontWeight: "700",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {neededCost > 0 ? (
                        <>New Funds Needed: <span style={{ marginRight: "0.2rem" }}>৳</span>{neededCost.toLocaleString()}</>
                      ) : (
                        "✓ 100% Fully Stocked"
                      )}
                    </div>
                  </div>

                  {/* Download Procurement PDF Button (Shop-ready, no prices) */}
                  {activeProject.bom && activeProject.bom.length > 0 && (
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={handleDownloadProjectPDF}
                      title="Download printable store procurement slip without estimated prices for local electronics shop purchases"
                      style={{
                        background: "#fffdfa",
                        borderColor: "#7A1C24",
                        color: "#7A1C24",
                        fontWeight: 700,
                      }}
                    >
                      <FileDown size={15} />
                      Download Store PDF
                    </button>
                  )}

                  {/* Requisition Button (for Store/Admin procurement) */}
                  {neededItems.length > 0 && (
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={() => setIsRequisitionOpen(true)}
                      title="Send needed parts list to Admin for procurement"
                    >
                      <Send size={15} />
                      Request Parts from Admin ({neededItems.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Preset Components Bar */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.45rem", fontSize: "0.78rem", fontWeight: 700, color: "#5c5149" }}>
                  <Sparkles size={13} color="#d97706" />
                  <span>Quick Add Standard Bangladesh Robotics Parts:</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {BD_ROBOTICS_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      style={{
                        padding: "0.25rem 0.55rem",
                        borderRadius: "6px",
                        border: "1px solid #dfd7cc",
                        background: "#fdfbf7",
                        fontSize: "0.74rem",
                        color: "#4a4039",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                      title={`Quick add ${p.name} (৳${p.price} BDT)`}
                    >
                      <span>{p.name}</span>
                      <span style={{ fontWeight: 700, color: "#7A1C24" }}>৳{p.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* BOM Table */}
              <div style={{ overflowX: "auto" }}>
                <table
                  className={styles.table}
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    color: "#27211d",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle, #dfd7cc)" }}>
                      <th style={{ padding: "0.85rem 1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.86rem" }}>
                        Part Name
                      </th>
                      <th style={{ padding: "0.85rem 1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.86rem" }}>
                        Category
                      </th>
                      <th style={{ padding: "0.85rem 1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.86rem" }}>
                        Source / Vendor
                      </th>
                      <th style={{ padding: "0.85rem 1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.86rem" }}>
                        Unit Cost (BDT)
                      </th>
                      <th style={{ padding: "0.85rem 1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.86rem" }}>
                        Quantity
                      </th>
                      <th style={{ padding: "0.85rem 1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.86rem" }}>
                        Total Cost
                      </th>
                      <th style={{ padding: "0.85rem 1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.86rem" }}>
                        Status
                      </th>
                      <th style={{ padding: "0.85rem 1rem", textAlign: "right", color: "#6f665e", fontWeight: 700, fontSize: "0.86rem" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!activeProject.bom || activeProject.bom.length === 0) && (
                      <tr>
                        <td colSpan={8} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#7c7067" }}>
                          No components added yet. Use the quick presets above or the form on the right to add parts to this Bill of Materials.
                        </td>
                      </tr>
                    )}
                    {activeProject.bom?.map((item: BOMItem) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", transition: "background 0.15s ease" }}
                      >
                        <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>{item.name}</td>
                        <td style={{ padding: "0.85rem 1rem", color: "#6f665e" }}>{item.category || "General"}</td>
                        <td style={{ padding: "0.85rem 1rem", color: "#6f665e" }}>{item.source}</td>
                        <td style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)" }}>
                          ৳{(Number(item.price) || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>{item.quantity}</td>
                        <td
                          style={{
                            padding: "0.85rem 1rem",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            color: "var(--brand-burgundy, #84243a)",
                          }}
                        >
                          ৳{(Number(item.totalCost) || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: "0.85rem 1rem" }}>
                          {renderStatusBadge(item.status, item.expectedArrivalDate)}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                            <button
                              type="button"
                              className={styles.actionBtn}
                              onClick={() => handleOpenEdit(item)}
                              title="Edit Item"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              className={styles.actionBtn}
                              style={{ color: "#dc2626" }}
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              title="Remove Item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Panel: Add Component Form */}
          <div>
            <div className={styles.panel}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: "1rem", color: "#27211d" }}>
                Add Component to BOM
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                  background: "var(--bg-main, #f8f6f2)",
                  padding: "0.25rem",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.45rem",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    background: addMode === "custom" ? "#fff" : "transparent",
                    color: addMode === "custom" ? "#27211d" : "#6f665e",
                    boxShadow: addMode === "custom" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setAddMode("custom")}
                >
                  Custom Market Part
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.45rem",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    background: addMode === "inventory" ? "#fff" : "transparent",
                    color: addMode === "inventory" ? "#27211d" : "#6f665e",
                    boxShadow: addMode === "inventory" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setAddMode("inventory")}
                >
                  From Lab Inventory
                </button>
              </div>

              <form onSubmit={handleAddItemToBOM}>
                {addMode === "inventory" ? (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.4rem", color: "#6f665e", fontWeight: 600 }}>
                      Choose Inventory Part
                    </label>
                    <select
                      className={styles.select}
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      required
                    >
                      <option value="">-- Select Lab Component --</option>
                      {inventory.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} (Stock: {inv.quantity || 0}) — ৳{inv.price || 150}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ display: "block", marginBottom: "0.35rem", color: "#6f665e", fontWeight: 600 }}>
                        Component Name
                      </label>
                      <input
                        className={styles.input}
                        placeholder="e.g. 6V Mini USB Water Pump"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ display: "block", marginBottom: "0.35rem", color: "#6f665e", fontWeight: 600 }}>
                        Category
                      </label>
                      <select
                        className={styles.select}
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      >
                        {STANDARD_INVENTORY_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.85rem" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", marginBottom: "0.35rem", color: "#6f665e", fontWeight: 600 }}>
                          Unit Price (BDT)
                        </label>
                        <input
                          type="number"
                          min="0"
                          className={styles.input}
                          value={customPrice}
                          onChange={(e) => setCustomPrice(Number(e.target.value))}
                          required
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", marginBottom: "0.35rem", color: "#6f665e", fontWeight: 600 }}>
                          Vendor / Source
                        </label>
                        <input
                          className={styles.input}
                          value={customSource}
                          onChange={(e) => setCustomSource(e.target.value)}
                          placeholder="e.g. RoboShop BD"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "0.35rem", color: "#6f665e", fontWeight: 600 }}>
                    Quantity Required
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={styles.input}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                  />
                </div>

                <button type="submit" className={styles.btn}>
                  <Plus size={16} />
                  <span>Add Component to BOM</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "3rem 1rem",
            textAlign: "center",
            background: "#fff",
            borderRadius: "12px",
            border: "1px dashed #dfd7cc",
          }}
        >
          <Layers size={36} color="#7A1C24" style={{ marginBottom: "0.75rem" }} />
          <h3 style={{ margin: "0 0 0.4rem", color: "#27211d" }}>No Projects Selected</h3>
          <p style={{ margin: "0 0 1rem", color: "#7c7067", fontSize: "0.88rem" }}>
            Create a new Bill of Materials project or select an existing build from the dropdown above.
          </p>
          <button
            type="button"
            className={styles.btn}
            style={{ width: "auto", margin: "0 auto" }}
            onClick={() => setIsProjectCreateOpen(true)}
          >
            <Plus size={15} />
            <span>Create New Project</span>
          </button>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {editingItem && (
        <div className={styles.modalOverlay} onClick={() => setEditingItem(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Component</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setEditingItem(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className={styles.modalBody}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                    Part Name
                  </label>
                  <input
                    className={styles.input}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                    Category
                  </label>
                  <select
                    className={styles.select}
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    {STANDARD_INVENTORY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                      Unit Price (BDT)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      className={styles.input}
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                    Source / Vendor
                  </label>
                  <input
                    className={styles.input}
                    value={editSource}
                    onChange={(e) => setEditSource(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                    Procurement Status
                  </label>
                  <select
                    className={styles.select}
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="Needed">Needed (To Procure)</option>
                    <option value="Requested">Requested (Pending Admin)</option>
                    <option value="Approved">Approved (In Procurement)</option>
                    <option value="In Stock">In Stock (Available in Lab)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(132, 36, 58, 0.06)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                  }}
                >
                  <span style={{ color: "#6f665e" }}>Total Calculated Cost:</span>
                  <span style={{ color: "#84243a", fontFamily: "var(--font-mono)" }}>
                    ৳{(editPrice * editQuantity).toLocaleString()} BDT
                  </span>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btn} style={{ width: "auto" }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEND REQUISITION TO ADMIN MODAL */}
      {isRequisitionOpen && activeProject && (
        <div className={styles.modalOverlay} onClick={() => setIsRequisitionOpen(false)}>
          <div className={styles.modalContent} style={{ maxWidth: "640px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Submit Parts Requisition</h3>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#6f665e" }}>
                  Project: <strong>{activeProject.name}</strong>
                </p>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsRequisitionOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitRequisition}>
              <div className={styles.modalBody}>
                <p style={{ fontSize: "0.9rem", color: "#6f665e", margin: 0 }}>
                  The following <strong>{neededItems.length}</strong> part(s) are needed and not in lab storage. They will be submitted to the Admin Parts Queue for review, approval, and procurement.
                </p>

                <div
                  style={{
                    maxHeight: "220px",
                    overflowY: "auto",
                    border: "1px solid var(--border-subtle, #dfd7cc)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
                    <thead style={{ background: "rgba(0,0,0,0.03)" }}>
                      <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <th style={{ padding: "0.6rem 0.8rem", textAlign: "left", color: "#6f665e" }}>Part</th>
                        <th style={{ padding: "0.6rem 0.8rem", textAlign: "left", color: "#6f665e" }}>Category</th>
                        <th style={{ padding: "0.6rem 0.8rem", textAlign: "center", color: "#6f665e" }}>Qty</th>
                        <th style={{ padding: "0.6rem 0.8rem", textAlign: "right", color: "#6f665e" }}>Est. Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {neededItems.map((item: BOMItem, i: number) => (
                        <tr key={item.id || i} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          <td style={{ padding: "0.6rem 0.8rem", fontWeight: 600 }}>{item.name}</td>
                          <td style={{ padding: "0.6rem 0.8rem", color: "#6f665e" }}>{item.category || "General"}</td>
                          <td style={{ padding: "0.6rem 0.8rem", textAlign: "center" }}>{item.quantity}</td>
                          <td style={{ padding: "0.6rem 0.8rem", textAlign: "right", fontWeight: 700, color: "#84243a" }}>
                            ৳{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.85rem 1rem",
                    background: "rgba(132, 36, 58, 0.08)",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 700,
                  }}
                >
                  <span style={{ color: "#27211d" }}>Total Requisition Amount:</span>
                  <span style={{ color: "#84243a", fontSize: "1.1rem", fontFamily: "var(--font-mono)" }}>
                    ৳{neededItems.reduce((sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0).toLocaleString()}
                  </span>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                    Requisition Notes / Urgency (Optional)
                  </label>
                  <textarea
                    className={styles.input}
                    style={{ minHeight: "70px", resize: "vertical", color: "#27211d" }}
                    placeholder="e.g. Critical components needed before next Friday's sprint assembly."
                    value={requisitionNotes}
                    onChange={(e) => setRequisitionNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsRequisitionOpen(false)}
                  disabled={isSubmittingRequisition}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btn}
                  style={{ width: "auto" }}
                  disabled={isSubmittingRequisition}
                >
                  {isSubmittingRequisition ? "Sending Request..." : "Confirm & Send to Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BOMDashboard() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "3rem", textAlign: "center", color: "#7c7067" }}>
          Loading Project Budgets & Bills of Material...
        </div>
      }
    >
      <BOMDashboardContent />
    </Suspense>
  );
}
