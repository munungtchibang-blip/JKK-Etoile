import React, { useState, useEffect } from "react";
import { Package, Users, ShoppingBag, Car, Plane, Search, Bell, Settings as SettingsIcon, LogOut, ChevronRight, BarChart3, Edit, Trash2, CheckCircle, CheckCircle2, Clock, Truck, XCircle, UploadCloud, X, Image as ImageIcon, Home as HomeIcon, ArrowDownCircle, Megaphone, Star, RefreshCcw, CreditCard, MessageCircle, Pencil, Mail, FileText, Building2, Plus, Save, Menu } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useSiteConfig, AnnouncementItem } from "../components/SiteContext";
import { auth, signInWithGoogle, logout } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Admin() {
  const { config, updateConfig } = useSiteConfig();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      if (user && user.email && config.admins && config.admins.includes(user.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, [config.admins]);

  const handleAdminLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (!user?.email || !config.admins?.includes(user.email)) {
        alert("Accès non autorisé. Vous n'êtes pas administrateur.");
        logout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const finalStatuses = ['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'];
  const isArchived = (s: string) => finalStatuses.includes(s);
  const [expandedTransferId, setExpandedTransferId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const handleMessageClick = (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
       updateConfig({
          messages: config.messages.map((m: any) => m.id === msg.id ? { ...m, isRead: true } : m)
       });
    }
  };
  const orders = config.orders || [];
  const setOrders = (newOrders: any[]) => updateConfig({ orders: newOrders });
  const [orderSort, setOrderSort] = useState<"date_desc" | "date_asc" | "client_asc" | "client_desc">("date_desc");

    const calculateTotalRevenue = () => {
    let total = 0;
    const allTransfers = config.transfers || [];
    allTransfers.forEach(t => {
      if (t.amount) {
        const match = String(t.amount).match(/([\d\s.,]+)/);
        if (match) {
          total += parseFloat(match[1].replace(/[\s,]/g, ''));
        }
      }
    });

    const allOrders = config.orders || [];
    allOrders.forEach(o => {
      const itemText = o.item ? String(o.item).toLowerCase() : "";
      
      const product = config.products?.find(p => p.name && itemText.includes(String(p.name).toLowerCase()));
      if (product && product.price) {
        const match = String(product.price).match(/([\d\s.,]+)/);
        if (match) {
           const qtyMatch = itemText.match(/(\d+)x/);
           const qty = qtyMatch ? parseFloat(qtyMatch[1]) : 1;
           total += parseFloat(match[1].replace(/[\s,]/g, '')) * qty;
        }
      }
      
      const car = config.cars?.find(c => c.brand && c.model && itemText.includes(`${String(c.brand).toLowerCase()} ${String(c.model).toLowerCase()}`));
      if (car && car.price) {
        const match = String(car.price).match(/([\d\s.,]+)/);
        if (match) total += parseFloat(match[1].replace(/[\s,]/g, ''));
      }
      
      const service = config.services?.find(s => s.name && itemText.includes(String(s.name).toLowerCase()));
      if (service && service.price) {
        const match = String(service.price).match(/([\d\s.,]+)/);
        if (match) total += parseFloat(match[1].replace(/[\s,]/g, ''));
      }
    });
    
    return "$" + total.toLocaleString('en-US');
  };

  const getUniqueClientsCount = () => {
    const clients = new Set([
      ...(config.orders || []).map(o => o.client ? String(o.client).trim().toLowerCase() : ""),
      ...(config.transfers || []).map(t => t.client ? String(t.client).trim().toLowerCase() : "")
    ]);
    clients.delete("");
    clients.delete(undefined as any);
    return clients.size.toString();
  };

  const finalStatusesList = ['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'];
  const sortedOrders = [...orders].filter(o => showArchived || !finalStatusesList.includes(o.status)).sort((a, b) => {
    if (orderSort.startsWith("date")) {
      const dateVal = (d: string) => d === "Aujourd'hui" ? 2 : d === "Hier" ? 1 : 0;
      return orderSort === "date_desc" ? dateVal(b.date || "") - dateVal(a.date || "") : dateVal(a.date || "") - dateVal(b.date || "");
    } else {
      return orderSort === "client_asc" ? String(a.client || "").localeCompare(String(b.client || "")) : String(b.client || "").localeCompare(String(a.client || ""));
    }
  });

  const adminCars = config.cars || [];

  const [services, setServices] = useState([
    {
      id: 1,
      type: "Visa",
      name: "Visa Dubai 30 Jours",
      price: "$150",
      available: true,
    },
    {
      id: 2,
      type: "Vol",
      name: "Billet Kinshasa - Dubai (Aller/Retour)",
      price: "$850",
      available: true,
    },
  ]);

  const [showAddCar, setShowAddCar] = useState(false);
  const [editCarId, setEditCarId] = useState<number | string | null>(null);
  const [carForm, setCarForm] = useState({
    brand: "Toyota",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    condition: "Occasion",
    image: "",
    fuel: "Essence",
    trans: "Automatique",
    mileage: "0 km",
    features: ""
  });

  const [showAddService, setShowAddService] = useState(false);
  const [newServiceType, setNewServiceType] = useState("Visa");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");

  const handleSaveCar = () => {
    if (carForm.model && carForm.price) {
      const priceNum = Number(carForm.price);
      const newCar = {
        id: editCarId || Date.now(),
        brand: carForm.brand,
        model: carForm.model,
        year: carForm.year,
        price: priceNum,
        priceStr: `${priceNum.toLocaleString()}$`,
        condition: carForm.condition,
        image: carForm.image || "https://images.unsplash.com/photo-1549314451-11883be1ce5c?q=80&w=1770&auto=format&fit=crop",
        gallery: [carForm.image || "https://images.unsplash.com/photo-1549314451-11883be1ce5c?q=80&w=1770&auto=format&fit=crop"],
        specs: {
          fuel: carForm.fuel,
          trans: carForm.trans,
          mileage: carForm.mileage
        },
        features: carForm.features.split(",").map(f => f.trim()).filter(Boolean)
      };

      if (editCarId) {
        updateConfig({
          cars: (config.cars || []).map(c => c.id === editCarId ? newCar : c)
        });
        showToast("Véhicule modifié avec succès");
      } else {
        updateConfig({
          cars: [...(config.cars || []), newCar]
        });
        showToast("Véhicule ajouté avec succès");
      }
      setShowAddCar(false);
      setEditCarId(null);
      setCarForm({
        brand: "Toyota",
        model: "",
        year: new Date().getFullYear(),
        price: "",
        condition: "Occasion",
        image: "",
        fuel: "Essence",
        trans: "Automatique",
        mileage: "0 km",
        features: ""
      });
    }
  };

  const handleEditCar = (car: any) => {
    setEditCarId(car.id);
    setCarForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price.toString(),
      condition: car.condition,
      image: car.image,
      fuel: car.specs.fuel,
      trans: car.specs.trans,
      mileage: car.specs.mileage,
      features: car.features.join(", ")
    });
    setShowAddCar(true);
  };


  const addService = () => {
    if (newServiceName && newServicePrice) {
      setServices([
        ...services,
        {
          id: Date.now(),
          type: newServiceType,
          name: newServiceName,
          price: newServicePrice,
          available: true,
        },
      ]);
      setShowAddService(false);
      setNewServiceName("");
      setNewServicePrice("");
      setNewServiceDescription("");
      showToast("Service ajouté avec succès");
    }
  };

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showShopConfig, setShowShopConfig] = useState(false);
  const [shopTitle, setShopTitle] = useState(config.shopTitle || "");
  const [shopDescription, setShopDescription] = useState(config.shopDescription || "");
  const [shopCoverImage, setShopCoverImage] = useState(config.shopCoverImage || "");

  const saveShopConfig = () => {
    updateConfig({
      ...config,
      shopTitle,
      shopDescription,
      shopCoverImage,
    });
    showToast("Configuration de la boutique mise à jour");
    setShowShopConfig(false);
  };

  const [newProductName, setNewProductName] = useState("");
  const [mmInput, setMmInput] = useState<string | null>(null);
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductType, setNewProductType] = useState("iphone");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductGallery, setNewProductGallery] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductStock, setNewProductStock] = useState("En stock");

  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [editProductPrice, setEditProductPrice] = useState("");

  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<AnnouncementItem | null>(null);
  const [announcementForm, setAnnouncementForm] = useState<
    Partial<AnnouncementItem>
  >({
    type: "annonce",
    title: "",
    description: "",
    active: true,
    date: new Date().toLocaleDateString("fr-FR"),
  });

  const handleSaveAnnouncement = () => {
    if (!announcementForm.title) return;

    let updated;
    if (editingAnnouncement) {
      updated = (config.announcements || []).map((a) =>
        a.id === editingAnnouncement.id
          ? ({ ...a, ...announcementForm } as AnnouncementItem)
          : a,
      );
    } else {
      updated = [
        {
          ...announcementForm,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toLocaleDateString("fr-FR"),
        } as AnnouncementItem,
        ...(config.announcements || []),
      ];
    }

    updateConfig({ announcements: updated });
    setShowAddAnnouncement(false);
    setEditingAnnouncement(null);
    setAnnouncementForm({
      type: "annonce",
      title: "",
      description: "",
      active: true,
      date: new Date().toLocaleDateString("fr-FR"),
    });
    showToast("Annonce sauvegardée");
  };

  const handleDeleteAnnouncement = (id: string) => {
    updateConfig({
      announcements: (config.announcements || []).filter((a) => a.id !== id),
    });
    showToast("Annonce supprimée");
  };

  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const [newProductIsNew, setNewProductIsNew] = useState(false);

  const addProduct = () => {
    if (newProductName && newProductPrice) {
      updateConfig({
        products: [
          ...(config.products || []),
          {
            id: Date.now(),
            category: newProductType.toLowerCase(),
            name: newProductName,
            price: Number(newProductPrice),
            image: newProductImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
            gallery: newProductGallery ? newProductGallery.split(',').map(s => s.trim()) : [],
            description: newProductDescription,
            isNew: true, // mark as new
            available: true,
          } as any
        ]
      });
      setShowAddProduct(false);
      setNewProductName("");
      setNewProductPrice("");
      setNewProductImage("");
      setNewProductDescription("");
      setNewProductStock("En stock");
      showToast("Produit ajouté avec succès");
    }
  };

  const toggleAvailability = (
    id: number,
    listType: "products" | "cars" | "services",
  ) => {
    if (listType === "products") {
      updateConfig({
        products: (config.products || []).map((p) =>
          p.id === id ? { ...p, available: (p as any).available === false ? true : false } : p
        )
      });
      showToast("Disponibilité mise à jour");
      return;
    }
    if (listType === "cars") {
      updateConfig({
        cars: (config.cars || []).map((c) => (c.id === id ? { ...c, available: c.available === false ? true : false } : c))
      });
      showToast("Disponibilité du véhicule modifiée");
    } else {
      setServices(
        services.map((s) =>
          s.id === id ? { ...s, available: !s.available } : s,
        ),
      );
      showToast("Disponibilité du service modifiée");
    }
  };

  const deleteProduct = (id: number) => {
    updateConfig({
      products: (config.products || []).filter((p) => p.id !== id)
    });
    showToast("Produit supprimé");
  };

  const deleteCar = (id: number | string) => {
    updateConfig({ cars: (config.cars || []).filter((c) => c.id !== id) });
    showToast("Véhicule supprimé");
  };

  const deleteService = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
    showToast("Service supprimé");
  };

  const handleEditProduct = (id: number, price: string) => {
    setEditProductId(id);
    setEditProductPrice(price);
  };

  const saveProductPrice = () => {
    if (editProductId) {
      updateConfig({
        products: (config.products || []).map((p) =>
          p.id === editProductId ? { ...p, price: editProductPrice } : p,
        ),
      });
      setEditProductId(null);
      showToast("Prix du produit modifié");
    }
  };

  const updateOrderStatus = (id: string, newStatus: string) => {
    let colorClass = "";
    switch (newStatus) {
      case "En attente":
      case "En cours":
        colorClass = "text-amber-400 bg-amber-500/20 border-amber-500/40 font-semibold";
        break;
      case "Validé":
        colorClass = "text-emerald-400 bg-emerald-500/20 border-emerald-500/40 font-semibold";
        break;
      case "En transit":
        colorClass = "text-purple-400 bg-purple-500/20 border-purple-500/40 font-semibold";
        break;
      case "Expédiée":
        colorClass = "text-blue-400 bg-blue-500/20 border-blue-500/40 font-semibold font-semibold";
        break;
      case "Livré":
        colorClass = "text-teal-400 bg-teal-500/20 border-teal-500/40 font-semibold";
        break;
      case "Annulé":
        colorClass = "text-rose-400 bg-rose-500/20 border-rose-500/40 font-semibold";
        break;
      default:
        colorClass = "text-blue-400 bg-blue-500/20 border-blue-500/40 font-semibold";
    }

    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, status: newStatus, statusColor: colorClass } : o,
      ),
    );
  };

  const renderStatus = (status: string, colorClass: string) => {
    let Icon = Clock;
    if (status === "Validé" || status === "Livré") Icon = CheckCircle2;
    if (status === "En transit" || status === "Expédiée") Icon = Truck;
    if (status === "Annulé") Icon = XCircle;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] rounded border ${colorClass}`}
      >
        <Icon size={12} />
        {status}
      </span>
    );
  };

  const renderMultipleDropzone = (imagesStr: string, setImages: (val: string) => void) => {
    const images = imagesStr ? imagesStr.split(',').filter(Boolean) : [];
    return (
      <div className="w-full">
        <div
          className="border-2 border-dashed border-gold-muted/30 hover:border-gold/50 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-navy-800/50 mb-2"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.multiple = true;
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files) {
                const newImages: string[] = [];
                let processedCount = 0;
                Array.from(files).forEach((file) => {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const imgUrl = event.target?.result as string;
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      const MAX_WIDTH = 800; // Resize to max 800px width
                      let width = img.width;
                      let height = img.height;
                      
                      if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                      }
                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext('2d');
                      ctx?.drawImage(img, 0, 0, width, height);
                      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                      newImages.push(compressedDataUrl);
                      processedCount++;
                      if (processedCount === files.length) {
                        setImages([...images, ...newImages].join(','));
                      }
                    };
                    img.src = imgUrl;
                  };
                  reader.readAsDataURL(file);
                });
              }
            };
            input.click();
          }}
        >
          <UploadCloud size={20} className="text-gold mb-2 opacity-50" />
          <span className="text-[10px] text-text/50 uppercase tracking-widest font-medium">
            Ajouter images (Multiple)
          </span>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((imgUrl, idx) => (
              <div key={idx} className="relative w-16 h-16">
                <img src={imgUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImages(images.filter((_, i) => i !== idx).join(','));
                  }}
                  className="absolute top-1 right-1 bg-navy/80 hover:bg-red-500/80 text-white p-1 rounded-full backdrop-blur-sm transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

    const renderDropzone = (value: string, onChange: (val: string) => void) => {
    return (
      <div 
        className="relative border-2 border-dashed border-gold-muted/20 hover:border-gold/50 rounded-lg p-6 bg-navy-800/30 transition-all text-center flex flex-col items-center justify-center gap-2 group min-h-[120px] cursor-pointer"
        onClick={() => {
          if (value) return; 
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  let width = img.width;
                  let height = img.height;
                  const MAX_DIMENSION = 800;
                  if (width > height && width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                  } else if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                  }
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, width, height);
                  const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                  onChange(compressedDataUrl);
                };
                img.src = event.target?.result as string;
              };
              reader.readAsDataURL(file);
            }
          };
          input.click();
        }}
      >
        {value ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img src={value} alt="Preview" className="max-h-32 object-contain rounded" />
            <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                title="Supprimer l'image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <ImageIcon size={24} className="text-text/40 group-hover:text-gold transition-colors" />
            <p className="text-xs text-text/60">
              Appuyez pour sélectionner une image (mobile/pc)
            </p>
          </>
        )}
      </div>
    );
  };

  
const getPendingCount = (id: string, config: any) => {
    if (!config) return 0;
    if (id === 'orders') return (config.orders || []).filter((o: any) => o.status === "En attente").length;
    if (id === 'messages') return (config.messages || []).filter((o: any) => !o.isRead).length;
    if (id === 'transfers') return (config.transfers || []).filter((o: any) => o.status === "En attente").length;
    if (id === 'visas') return (config.orders || []).filter((o: any) => o.status === "En attente" && o.item && o.item.toLowerCase().includes('visa') && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))).length;
    if (id === 'flights') return (config.orders || []).filter((o: any) => o.status === "En attente" && o.item && (o.item.toLowerCase().includes('billet') || o.item.toLowerCase().includes('vol')) && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))).length;
    if (id === 'hotels') return (config.orders || []).filter((o: any) => o.status === "En attente" && o.item && (o.item.toLowerCase().includes('ho'))).length;
    if (id === 'cargo') return (config.orders || []).filter((o: any) => o.status === "En attente" && o.item && o.item.toLowerCase().includes('cargo') && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))).length;
    return 0;
};

  const menuItems = [
    { id: "dashboard", label: "Vue d'ensemble", icon: BarChart3 },
    { id: "orders", label: "Commandes", icon: ShoppingBag },
    { id: "transfers", label: "Transferts d'argent", icon: RefreshCcw },
    { id: "shop", label: "Boutique (Produits)", icon: ShoppingBag },
    { id: "cars", label: "Véhicules (Import)", icon: Car },
    { id: "services", label: "Services", icon: Plane },
    { id: "visas", label: "Gestion Visas", icon: FileText },
    { id: "flights", label: "Billets d'avion", icon: Plane },
    { id: "hotels", label: "Réservation d'hôtel", icon: Building2 },
    { id: "cargo", label: "Service cargo", icon: Package },
    { id: "announcements", label: "Annonces", icon: Bell },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "reviews", label: "Avis Clients", icon: Star },
    { id: "mobilemoney", label: "Mobile Money", icon: CreditCard },
    { id: "settings", label: "Paramètres", icon: SettingsIcon },
  ];

  if (isAuthChecking) {
    return (
      <div className="flex h-screen bg-navy text-text items-center justify-center pt-24">
        <div className="text-gold uppercase tracking-widest animate-pulse font-light">Vérification de l'accès...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col h-screen bg-navy text-text items-center justify-center p-4 pt-24">
        <h1 className="text-2xl font-display mb-2 text-center text-gold">Accès Restreint</h1>
        <p className="text-text/70 mb-8 max-w-md text-center text-sm">
          Cet espace est réservé aux administrateurs de JKK Etoile. 
          {adminUser?.email && (
            <span className="block mt-2 text-gold-muted font-medium">
              Connecté en tant que: {adminUser.email}
            </span>
          )}
        </p>
        {!adminUser ? (
          <button 
            onClick={handleAdminLogin}
            className="bg-gold text-navy px-8 py-3 rounded text-sm uppercase tracking-wider font-semibold hover:bg-[#d4b069] transition-colors"
          >
            Se connecter avec Google
          </button>
        ) : (
          <div className="flex gap-4">
             <button 
              onClick={handleAdminLogin}
              className="bg-text/10 text-text px-6 py-2 rounded text-xs uppercase tracking-wider font-semibold hover:bg-text/20 transition-colors"
            >
              Changer de compte
            </button>
            <button 
              onClick={() => logout()}
              className="bg-red-500/10 text-red-400 px-6 py-2 rounded text-xs uppercase tracking-wider font-semibold hover:bg-red-500 hover:text-white transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-navy text-text pt-0">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-30 bg-navy-800 border-b border-gold-muted/20 px-4 py-3 flex items-center justify-between">
        <h2 className="text-xl font-display tracking-wide">Gestion JKK</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-text hover:text-gold p-2 border border-gold-muted/20 rounded-md bg-glass"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-navy-800 border-r border-gold-muted/20 flex flex-col h-screen fixed z-40 top-0 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gold-muted/20 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[3px] text-gold block mb-2">
              Panel Administrateur
            </span>
            <h2 className="text-xl font-display tracking-wide">Gestion JKK</h2>
          </div>
          <button 
            className="md:hidden text-text/60 hover:text-text"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
             const badgeCount = getPendingCount(item.id, config);
             return (
               <button
                 key={item.id}
                 onClick={() => {
                   setActiveTab(item.id);
                   setIsMobileMenuOpen(false);
                 }}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === item.id ? "bg-gold/10 text-gold border border-gold/20" : "text-text/60 hover:text-text hover:bg-white/5"}`}
               >
                 <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                 </div>
                 {badgeCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-auto">
                      {badgeCount}
                    </span>
                 )}
               </button>
             );
          })}
        </nav>

        <div className="p-4 border-t border-gold-muted/20">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text/60 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
          >
            <LogOut size={18} />
            Quitter
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-navy px-4 pb-6 md:px-10 md:pb-10 pt-16 md:pt-0 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-0 pt-6">
          <div>
            <h1 className="text-3xl font-display">Administration</h1>
            <p className="text-sm text-text/90 font-medium  mt-1">
              Gérez votre plateforme JKK Etoile.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text/60 hover:text-gold transition-colors"
            >
              <HomeIcon size={16} />
              Retour au site
            </Link>
          </div>
        </header>

        {activeTab === "dashboard" && (
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3 }}
             className="space-y-6"
           >
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { title: "Revenus du mois", value: calculateTotalRevenue(), trend: "+12%", color: "text-green-400" },
                 { title: "Commandes en attente", value: orders.filter(o => o.status === "En cours").length.toString(), trend: "À traiter", color: "text-gold" },
                 { title: "Nouveaux clients", value: getUniqueClientsCount(), trend: "+18%", color: "text-blue-400" },
                 { title: "Total Commandes", value: orders.length.toString(), trend: "Global", color: "text-purple-400" },
               ].map((stat, i) => (
                 <div key={i} className="bg-glass border border-gold-muted/20 p-6 rounded-lg relative overflow-hidden group hover:border-gold/30 transition-all shadow-lg hover:shadow-gold/10">
                   <span className="text-[11px] uppercase tracking-wider text-text/70 font-medium block mb-2">{stat.title}</span>
                   <div className="flex items-end justify-between">
                     <span className="text-3xl font-display text-text">{stat.value}</span>
                     <span className={`text-[10px] font-bold px-2 py-1 bg-white/5 rounded ${stat.color}`}>{stat.trend}</span>
                   </div>
                 </div>
               ))}
             </div>
             
             <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden flex flex-col">
               <div className="p-6 border-b border-gold-muted/20 flex items-center justify-between bg-navy-800/50">
                 <h3 className="font-display tracking-wide text-lg text-text">Dernières Commandes</h3>
                 <button onClick={() => setActiveTab("orders")} className="text-[11px] uppercase tracking-wider text-gold font-semibold bg-gold/10 px-3 py-1.5 rounded">Voir tout</button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse whitespace-nowrap">
                   <thead>
                     <tr className="bg-navy-900/50 border-b border-gold-muted/30 text-[10px] uppercase tracking-widest text-text/60 font-bold">
                       <th className="p-4 font-normal">ID</th>
                       <th className="p-4 font-normal">Client</th>
                       <th className="p-4 font-normal">Statut</th>
                       <th className="p-4 font-normal text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm font-light text-text/80">
                     {sortedOrders.slice(0, 5).map((order, i) => (
                       <tr key={i} onClick={() => { setActiveTab("orders"); setExpandedOrderId(order.id); }} className="border-b border-gold-muted/10 hover:bg-gold/5 transition-all duration-200 cursor-pointer">
                         <td className="p-4 text-gold font-medium">{order.id}</td>
                         <td className="p-4">{order.client}</td>
                         <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
                         <td className="p-4 text-right flex justify-end">
                           <button onClick={(e) => {
                             e.stopPropagation();
                             const newOrders = [...config.orders || []].filter(o => o.id !== order.id);
                             updateConfig({ orders: newOrders });
                             showToast("Commande supprimée");
                           }} className="bg-red-500/10 text-red-500 w-6 h-6 flex items-center justify-center rounded"><Trash2 size={12} /></button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           </motion.div>
        )}

        {activeTab === "orders" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                          <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-display">Gestion des Commandes</h2>
              
               <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-text/80 bg-navy-800 p-2 rounded border border-gold-muted/20">
                 <input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="accent-gold rounded" />
                 Afficher l'historique et les traitées
               </label>
             </div>
             <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {sortedOrders.map((order) => (
                     <React.Fragment key={order.id}>
                                               <tr className="border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                          <td className="p-4 text-gold">{order.id}</td>
                          <td className="p-4">{order.client}</td>
                          <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
                          <td className="p-4 text-right flex justify-end gap-2">
                            <button onClick={(e) => {
                              e.stopPropagation();
                              const newOrders = [...(config.orders || [])].filter(o => o.id !== order.id);
                              updateConfig({ orders: newOrders });
                            }} className="bg-red-500/10 text-red-500 w-6 h-6 flex items-center justify-center rounded"><Trash2 size={12} /></button>
                          </td>
                        </tr>
                        {expandedOrderId === order.id && (
                          <tr className="bg-navy-800/30 border-b border-gold-muted/20">
                            <td colSpan={4} className="p-6 whitespace-normal border-t-0 p-0 m-0">
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-sm">
                                <div>
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Détails de la commande</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Article:</span> <span className="font-medium">{order.item || order.type || 'Billet/Visa'}</span></p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Montant:</span> {order.amount || order.price || 'N/A'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Date:</span> {order.date}</p>
                                   </div>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-gold-muted/10 pt-4 md:pt-0 md:pl-6">
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Informations Utilisateur</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Nom:</span> {order.client}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Téléphone:</span> {order.phone || 'Non renseigné'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Email:</span> {order.email || 'Non renseigné'}</p>
                                   </div>
                                   <div className="flex gap-3 mt-4">
                                     {order.phone && (
                                       <a href={`https://wa.me/${String(order.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         WhatsApp
                                       </a>
                                     )}
                                     {order.email && (
                                       <a href={`mailto:${order.email}`} onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         Email
                                       </a>
                                     )} {order.status !== "Terminé" && (<button onClick={(e) => { e.stopPropagation(); showToast("Statut mis à jour"); const isTransfer = order.id?.startsWith("#TR"); const prop = isTransfer ? "transfers" : "orders"; const updated = (config[prop] || []).map(o => o.id === order.id ? { ...o, status: "Terminé", statusColor: "text-green-400 bg-green-500/20 border-green-500/40 font-semibold" } : o); updateConfig({ [prop]: updated }); }} className="flex-1 flex justify-center py-2 items-center bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-navy rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">Terminer</button>)}
                                   </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                     </React.Fragment>
                   ))}
                 </tbody>
               </table>
             </div>
           </motion.div>
        )}

        {activeTab === "transfers" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-display">Gestion des Transferts</h2>
              
             </div>
             <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Montant</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {(config.transfers || []).map((transfer) => (
                     <React.Fragment key={transfer.id}>
                       <tr className="border-b border-white/5 cursor-pointer" onClick={() => setExpandedTransferId(expandedTransferId === transfer.id ? null : transfer.id)}>
                         <td className="p-4 text-gold">{transfer.id}</td>
                         <td className="p-4">{transfer.client}</td>
                         <td className="p-4">{transfer.amount}</td>
                         <td className="p-4">{renderStatus(transfer.status, transfer.statusColor || "")}</td>
                         <td className="p-4 text-right flex justify-end gap-2">
                           <button onClick={(e) => {
                             e.stopPropagation();
                             const newTransfers = [...config.transfers || []].filter(t => t.id !== transfer.id);
                             updateConfig({ transfers: newTransfers });
                           }} className="bg-red-500/10 text-red-500 w-6 h-6 flex items-center justify-center rounded"><Trash2 size={12} /></button>
                         </td>
                       </tr>
                      {expandedTransferId === transfer.id && (
                        <tr className="bg-navy-800/30 border-b border-gold-muted/20">
                          <td colSpan={10} className="p-6">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm"
                            >
                              <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-text/90 font-medium mb-2">
                                  Modifier le Statut
                                </h4>
                                <select
                                  value={transfer.status}
                                  onChange={(e) => {
                                    let color = "text-text/70";
                                    const val = e.target.value;
                                    if (val === "En attente") color = "text-yellow-400 bg-yellow-500/20 border-yellow-500/40 font-semibold";
                                    if (val === "En cours") color = "text-amber-400 bg-amber-500/20 border-amber-500/40 font-semibold";
                                    if (val === "Terminé" || val === "Validé") color = "text-green-400 bg-green-500/20 border-green-500/40 font-semibold";
                                    if (val === "Annulé") color = "text-red-400 bg-red-500/20 border-red-500/40 font-semibold";
                                    
                                    const newTransfers = config.transfers.map(t => 
                                      t.id === transfer.id ? { ...t, status: val, statusColor: color } : t
                                    );
                                    updateConfig({ transfers: newTransfers });
                                  }}
                                  className="w-full bg-navy border border-text/10 rounded p-2 text-xs text-text/80 focus:outline-none focus:border-gold/50"
                                >
                                  <option value="En attente">En attente</option>
                                  <option value="En cours">En cours</option>
                                  <option value="Terminé">Terminé</option>
                                  <option value="Annulé">Annulé</option>
                                </select>
                              </div>

                              <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-text/90 font-medium mb-2">
                                  Message / Réponse au Client
                               </h4>
                                <textarea
                                  className="w-full h-20 bg-navy border border-text/10 rounded p-2 text-xs text-text/80 focus:outline-none focus:border-gold/50"
                                  placeholder="Entrez votre réponse concernant ce transfert..."
                                  value={transfer.adminReply || ""}
                                  onChange={(e) => {
                                    const newTransfers = config.transfers.map(t => 
                                      t.id === transfer.id ? { ...t, adminReply: e.target.value } : t
                                    );
                                    updateConfig({ transfers: newTransfers });
                                  }}
                                />
                                <div className="flex justify-end gap-2 mt-2">
    {transfer.phone && (
      <a href={`https://wa.me/${String(transfer.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(transfer.adminReply || "Bonjour concernant votre transfert")}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] uppercase font-bold tracking-wider rounded hover:bg-green-500 hover:text-white transition-colors flex items-center gap-1">WhatsApp</a>
    )}
    <button
      onClick={(e) => {
        e.stopPropagation();
        showToast("Réponse enregistrée");
      }}
                                    className="px-3 py-1 bg-gold/20 text-gold border border-gold/30 text-[10px] uppercase font-bold tracking-wider rounded hover:bg-gold hover:text-navy transition-colors"
                                  >
                                    Enregistrer
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  {(!config.transfers || config.transfers.length === 0) && (
                     <tr>
                       <td colSpan={10} className="px-6 py-8 text-center text-text/50">
                         Aucun transfert enregistré.
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "shop" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display">Boutique (Produits)</h2>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowShopConfig(!showShopConfig)}
                  className="px-4 py-2 border border-gold text-gold font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-gold hover:text-[#0f172a] transition-colors"
                >
                  <SettingsIcon size={14} className="inline mr-2" />
                  Paramètres Page
                </button>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="px-4 py-2 bg-gold text-[#0f172a] font-semibold text-xs uppercase tracking-wider rounded-md"
                >
                  + Ajouter Produit
                </button>
              </div>
            </div>

            {showShopConfig && (
              <div className="bg-white/5 border border-gold/30 p-6 rounded-lg mb-6 shadow-lg shadow-gold/5">
                <h3 className="text-lg font-display mb-4 text-gold flex items-center gap-2">
                  <SettingsIcon size={18} /> Configuration de la page Boutique
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Titre de la boutique
                    </label>
                    <input
                      type="text"
                      value={shopTitle}
                      onChange={(e) => setShopTitle(e.target.value)}
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Description (sous-titre)
                    </label>
                    <input
                      type="text"
                      value={shopDescription}
                      onChange={(e) => setShopDescription(e.target.value)}
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Image d'en-tête
                    </label>
                    {renderDropzone(shopCoverImage, setShopCoverImage)}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={saveShopConfig}
                    className="px-6 py-2 bg-gold text-[#0f172a] font-bold text-xs uppercase tracking-wider rounded-md hover:bg-gold/90 transition-colors"
                  >
                    Enregistrer la configuration
                  </button>
                </div>
              </div>
            )}

            {showAddProduct && (
              <div className="bg-white/5 border border-text/10 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Prix
                  </label>
                  <input
                    type="text"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Type
                  </label>
                  <select
                    value={newProductType}
                    onChange={(e) => setNewProductType(e.target.value)}
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                  >
                    <option value="iphone">iPhone</option>
                    <option value="samsung">Samsung</option>
                    <option value="smartphones">Autres Smartphones</option>
                    <option value="parfums">Parfum</option>
                    <option value="gadgets">Gadget</option>
                  </select>
                </div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Image du Produit
                    </label>
                    {renderDropzone(newProductImage, setNewProductImage)}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                        Images Supplémentaires
                      </label>
                      {renderMultipleDropzone(newProductGallery, setNewProductGallery)}
                    </div>
                    <div>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newProductDescription}
                        onChange={(e) => setNewProductDescription(e.target.value)}
                        className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                      />
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3 flex justify-end mt-2">
                  <button
                    onClick={addProduct}
                    className="px-6 py-2.5 bg-gold/20 text-gold border border-gold rounded text-xs uppercase tracking-wider hover:bg-gold hover:text-[#0f172a] transition-colors"
                  >
                    Enregistrer le produit
                  </button>
                </div>
              </div>
            )}

            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-navy border-b border-gold-muted/30 text-[10px] uppercase tracking-widest text-text/60 font-bold">
                    <th className="p-4">Type</th>
                    <th className="p-4">Nom</th>
                    <th className="p-4">Prix</th>
                    <th className="p-4">Disponibilité</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-text/80">
                  {(config.products || []).map((product: any) => {
                    const isLowStock = false;
                    const isRecentlyUpdated = product.isNew;

                    return (
                    <tr
                      key={product.id}
                      className={`border-b border-gold-muted/10 hover:bg-gold/5 transition-all duration-200 group bg-navy/50 relative ${isLowStock ? 'bg-red-500/5' : isRecentlyUpdated ? 'bg-green-500/5' : ''}`}
                    >
                      <td className="p-4 text-text/90 font-medium">
                        {product.category || product.type}
                        {isLowStock && <span className="ml-2 bg-red-500 text-white text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded">Stock critique</span>}
                        {isRecentlyUpdated && !isLowStock && <span className="ml-2 bg-green-500 text-white text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded">Nouveau</span>}
                      </td>
                      <td className="p-4">{product.name}</td>
                      <td className="p-4 text-gold">{product.price}</td>
                      <td className="p-4">
                        <select
    className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider border outline-none cursor-pointer ${product.status === "Rupture" || (!product.status && product.available === false) ? "bg-red-500/10 text-red-500 border-red-500/20" : product.status === "Arrivage" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}
    value={product.status || (product.available === false ? "Rupture" : "En Stock")}
    onChange={(e) => {
        updateConfig({ products: (config.products || []).map(p => p.id === product.id ? {...p, status: e.target.value, available: e.target.value !== "Rupture"} : p) });
        showToast("Statut mis à jour");
    }}
>
    <option className="bg-navy text-text" value="En Stock">En Stock</option>
    <option className="bg-navy text-text" value="Rupture">Rupture</option>
    <option className="bg-navy text-text" value="Arrivage">Arrivage</option>
</select>
                      </td>
                      <td className="p-4 justify-end flex gap-2">
                        <button
                          onClick={() =>
                            handleEditProduct(product.id, product.price)
                          }
                          className="p-1 hover:text-gold transition-colors text-text/90 font-medium"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1 hover:text-red-400 transition-colors text-text/90 font-medium"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "cars" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display">Véhicules (Auto Import)</h2>
              
              <button
                onClick={() => setShowAddCar(!showAddCar)}
                className="px-4 py-2 bg-gold text-[#0f172a] font-semibold text-xs uppercase tracking-wider rounded-md"
              >
                + Ajouter Véhicule
              </button>
            </div>

            {showAddCar && (
              <div className="bg-white/5 border border-text/10 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Marque
                    </label>
                    <input
                      type="text"
                      value={carForm.brand}
                      onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })}
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Nom du Modèle
                    </label>
                    <input
                      type="text"
                      value={carForm.model}
                      onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Carburant
                    </label>
                    <input
                      type="text"
                      value={carForm.fuel}
                      onChange={(e) => setCarForm({ ...carForm, fuel: e.target.value })}
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Boîte de Vitesse (Trans)
                    </label>
                    <input
                      type="text"
                      value={carForm.trans}
                      onChange={(e) => setCarForm({ ...carForm, trans: e.target.value })}
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Prix (en $)
                    </label>
                    <input
                      type="number"
                      value={carForm.price}
                      onChange={(e) => setCarForm({ ...carForm, price: e.target.value })}
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Année
                    </label>
                    <input
                      type="number"
                      value={carForm.year}
                      onChange={(e) => setCarForm({ ...carForm, year: Number(e.target.value) })}
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                    />
                  </div>
                </div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Image URL
                    </label>
                    {renderDropzone(carForm.image, (val) => setCarForm({ ...carForm, image: val || "" }))}
                  </div>
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Fonctionnalités (séparées par des virgules)
                    </label>
                    <input
                      type="text"
                      value={carForm.features}
                      onChange={(e) => setCarForm({ ...carForm, features: e.target.value })}
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                      placeholder="Toit ouvrant, Caméra 360..."
                    />
                  </div>
                </div>
                <div className="lg:col-span-3 flex justify-end mt-2">
                  <button
                    onClick={handleSaveCar}
                    className="px-6 py-2.5 bg-gold/20 text-gold border border-gold rounded text-xs uppercase tracking-wider hover:bg-gold hover:text-[#0f172a] transition-colors"
                  >
                    {editCarId ? "Modifier le véhicule" : "Enregistrer le véhicule"}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase tracking-widest text-gold font-bold">
                    <th className="p-4">Modèle</th>
                    <th className="p-4">Marque</th>
                    <th className="p-4">Année</th>
                    <th className="p-4">Prix</th>
                    <th className="p-4">Disponibilité</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-text/80">
                  {adminCars.map((car) => (
                    <tr
                      key={car.id}
                      className="border-b border-gold-muted/10 hover:bg-gold/5 transition-all duration-200 group bg-navy/50"
                    >
                      <td className="p-4">{car.model}</td>
                      <td className="p-4 text-text/90 font-medium">
                        {car.brand}
                      </td>
                      <td className="p-4">{car.year}</td>
                      <td className="p-4 text-gold">{car.priceStr}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleAvailability(car.id, "cars")}
                          className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider border transition-colors ${car.available !== false ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                        >
                          {car.available !== false ? "Disponible" : "Indisponible"}
                        </button>
                      </td>
                      <td className="p-4 justify-end flex gap-2">
                        <button
                          onClick={() => handleEditCar(car)}
                          className="p-1 hover:text-blue-400 transition-colors text-text/90 font-medium"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteCar(car.id)}
                          className="p-1 hover:text-red-400 transition-colors text-text/90 font-medium"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "flights" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display">Vols & Visas</h2>
              
              <button
                onClick={() => setShowAddService(!showAddService)}
                className="px-4 py-2 bg-gold text-[#0f172a] font-semibold text-xs uppercase tracking-wider rounded-md"
              >
                + Ajouter Service
              </button>
            </div>

            {showAddService && (
              <div className="bg-white/5 border border-text/10 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Nom du service
                  </label>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Prix
                  </label>
                  <input
                    type="text"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Type
                  </label>
                  <select
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value)}
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                  >
                    <option>Visa</option>
                    <option>Vol</option>
                  </select>
                </div>
                <div className="lg:col-span-3">
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text"
                  />
                </div>
                <div className="lg:col-span-3 flex justify-end mt-2">
                  <button
                    onClick={addService}
                    className="px-6 py-2.5 bg-gold/20 text-gold border border-gold rounded text-xs uppercase tracking-wider hover:bg-gold hover:text-[#0f172a] transition-colors"
                  >
                    Enregistrer le service
                  </button>
                </div>
              </div>
            )}

            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-navy border-b border-gold-muted/30 text-[10px] uppercase tracking-widest text-text/60 font-bold">
                    <th className="p-4">Type</th>
                    <th className="p-4">Nom</th>
                    <th className="p-4">Prix</th>
                    <th className="p-4">Disponibilité</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-text/80">
                  {services.map((service) => (
                    <tr
                      key={service.id}
                      className="border-b border-gold-muted/10 hover:bg-gold/5 transition-all duration-200 group bg-navy/50"
                    >
                      <td className="p-4 text-text/90 font-medium">
                        {service.type}
                      </td>
                      <td className="p-4">{service.name}</td>
                      <td className="p-4 text-gold">{service.price}</td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            toggleAvailability(service.id, "services")
                          }
                          className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider border transition-colors ${service.available ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                        >
                          {service.available ? "Disponible" : "Indisponible"}
                        </button>
                      </td>
                      <td className="p-4 justify-end flex gap-2">
                        <button
                          onClick={() => deleteService(service.id)}
                          className="p-1 hover:text-red-400 transition-colors text-text/90 font-medium"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "announcements" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display">
                Annonces & Offres Spéciales
              </h2>
              <button
                onClick={() => {
                  setEditingAnnouncement(null);
                  setAnnouncementForm({
                    type: "annonce",
                    title: "",
                    description: "",
                    active: true,
                    date: new Date().toLocaleDateString("fr-FR"),
                  });
                  setShowAddAnnouncement(!showAddAnnouncement);
                }}
                className="flex items-center gap-2 bg-gold px-4 py-2 text-[#0f172a] text-xs font-semibold uppercase tracking-wider rounded transition-colors hover:bg-[#d4b069]"
              >
                <Edit size={16} />{" "}
                {showAddAnnouncement || editingAnnouncement
                  ? "Fermer"
                  : "Ajouter"}
              </button>
            </div>

            {(showAddAnnouncement || editingAnnouncement) && (
              <div className="bg-navy-800 border border-gold-muted/30 p-6 rounded-lg mb-6 shadow-xl relative">
                <button
                  onClick={() => {
                    setShowAddAnnouncement(false);
                    setEditingAnnouncement(null);
                  }}
                  className="absolute top-4 right-4 text-text/50 hover:text-text"
                >
                  <X size={18} />
                </button>
                <h3 className="text-lg font-display text-gold mb-4">
                  {editingAnnouncement
                    ? "Modifier l'annonce"
                    : "Nouvelle annonce"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Type
                    </label>
                    <select
                      value={announcementForm.type}
                      onChange={(e) =>
                        setAnnouncementForm({
                          ...announcementForm,
                          type: e.target.value as any,
                        })
                      }
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                    >
                      <option value="annonce">Annonce générale</option>
                      <option value="arrivage">Nouvel arrivage</option>
                      <option value="offre">Offre spéciale</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={announcementForm.title}
                      onChange={(e) =>
                        setAnnouncementForm({
                          ...announcementForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="Ex: Arrivage iPhone 16"
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Image 
                    </label>
                    {renderDropzone(announcementForm.image || "", (val) => setAnnouncementForm({ ...announcementForm, image: val }) )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Date de l'annonce
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="date"
                        value={announcementForm.date?.split(" ")[0] || ""}
                        onChange={(e) => {
                          const timePart = announcementForm.date?.split(" ")[1] || "00:00";
                          setAnnouncementForm({
                            ...announcementForm,
                            date: `${e.target.value} ${timePart}`,
                          });
                        }}
                        className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                      />
                      <input
                        type="time"
                        value={announcementForm.date?.split(" ")[1] || ""}
                        onChange={(e) => {
                          const datePart = announcementForm.date?.split(" ")[0] || new Date().toISOString().split("T")[0];
                          setAnnouncementForm({
                            ...announcementForm,
                            date: `${datePart} ${e.target.value}`,
                          });
                        }}
                        className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                      Description
                    </label>
                    <textarea
                      value={announcementForm.description}
                      onChange={(e) =>
                        setAnnouncementForm({
                          ...announcementForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Détails de l'annonce..."
                      rows={3}
                      className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mt-4">
                      <input
                        type="checkbox"
                        checked={announcementForm.active}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            active: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-gold"
                      />
                      <span className="text-sm text-text/90">
                        Publier immédiatement
                      </span>
                    </label>
                  </div>
                  <div className="flex justify-end items-center mt-4 md:col-span-2">
                    <button
                      onClick={handleSaveAnnouncement}
                      className="px-6 py-2.5 bg-gold text-[#0f172a] font-semibold text-xs uppercase tracking-wider rounded hover:bg-[#c4a059] transition-colors"
                    >
                      {editingAnnouncement
                        ? "Enregistrer les modifications"
                        : "Ajouter l'annonce"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg p-6">
              <p className="text-sm text-text/80 mb-6">
                Gérez vos arrivages, offres spéciales et annonces importantes
                affichés sur le site.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {config.announcements &&
                  config.announcements.map((ann, idx) => (
                    <div
                      key={ann.id || idx}
                      className="bg-navy border border-gold-muted/20 rounded-lg p-4 relative group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase tracking-wider bg-gold/20 text-gold px-2 py-1 rounded">
                          {ann.type === "arrivage"
                            ? "Nouvel Arrivage"
                            : ann.type === "offre"
                              ? "Offre Spéciale"
                              : "Annonce"}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingAnnouncement(ann);
                              setAnnouncementForm(ann);
                              setShowAddAnnouncement(true);
                            }}
                            className="text-text/60 hover:text-gold"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="text-text/60 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-medium text-text mb-1">
                        {ann.title}
                      </h4>
                      <p className="text-xs text-text/70 line-clamp-2 mb-3">
                        {ann.description}
                      </p>
                      <div className="flex justify-between text-[10px] text-text/50">
                        <span>{ann.date}</span>
                        <span
                          className={
                            ann.active ? "text-green-400" : "text-text/40"
                          }
                        >
                          {ann.active ? "En ligne" : "Masqué"}
                        </span>
                      </div>
                    </div>
                  ))}

                {(!config.announcements ||
                  config.announcements.length === 0) && (
                  <div className="col-span-full py-12 text-center text-text/60 border border-dashed border-gold-muted/30 rounded-lg bg-white/5">
                    Aucune annonce ou offre actuellement.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "messages" && (
          <div className="animate-fade-in p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl tracking-tight text-white mb-1">
                  Messages de Contact
                </h2>
                <p className="text-sm font-medium text-text/60 uppercase tracking-widest">
                  Boîte de réception des clients
                </p>
              </div>
            </div>

            <div className="bg-navy-800 border border-gold/20 overflow-hidden shadow-lg">
              {(!config.messages || config.messages.length === 0) ? (
                <div className="p-12 text-center text-text/60">
                  <Mail size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Aucun message pour le moment.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase tracking-wider text-gold font-bold">
                        <th className="p-4 font-semibold w-[150px]">Date</th>
                        <th className="p-4 font-semibold">Client</th>
                        <th className="p-4 font-semibold">Contact</th>
                        <th className="p-4 font-semibold">Sujet</th>
                        <th className="p-4 font-semibold text-right w-[150px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {(config.messages || []).map((msg) => (
                        <tr
                          key={msg.id}
                          className={`hover:bg-white/5 transition-colors group cursor-pointer ${!msg.isRead ? 'font-bold bg-white/5' : ''}`}
                          onClick={() => handleMessageClick(msg)}
                        >
                          <td className="p-4">
                            <span className="text-sm text-text/90 block">
                              {msg.date}
                            </span>
                            <span className="text-[10px] text-text/50 uppercase tracking-wider">
                              {msg.id}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-white block">
                              {msg.name}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col gap-1 text-xs text-text/80">
                              <span className="flex items-center gap-2">
                                <MessageCircle size={12} className="text-gold" /> {msg.phone}
                              </span>
                              <span className="flex items-center gap-2">
                                <Mail size={12} className="text-text/50" /> {msg.email}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium text-white mb-2">
                              {msg.subject}
                            </div>
                            <div className="text-sm text-text/70 line-clamp-2">
                              {msg.message}
                            </div>
                          </td>
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              {msg.phone && (
                                <a
                                  href={`https://wa.me/${String(msg.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${msg.name}, suite à votre message : "${msg.subject}"`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-text/50 hover:text-[#25D366] transition-colors"
                                  title="Répondre sur WhatsApp"
                                >
                                  <MessageCircle size={18} />
                                </a>
                              )}
                              <a
                                href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}`}
                                className="p-2 text-text/50 hover:text-white transition-colors"
                                title="Répondre par email"
                              >
                                <Mail size={18} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMessage(null)}>
            <div className="bg-navy-800 border border-gold/20 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedMessage(null)} className="absolute top-4 right-4 text-text/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <div className="mb-6 pb-6 border-b border-white/10">
                <h2 className="text-2xl font-display mb-2">{selectedMessage.subject}</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white text-lg">{selectedMessage.name}</p>
                    <p className="text-text/70">{selectedMessage.date}</p>
                  </div>
                  <div className="flex flex-col text-right gap-1">
                    <a href={`mailto:${selectedMessage.email}`} className="flex items-center justify-end gap-2 text-text/80 hover:text-white transition-colors">
                      <Mail size={14} className="text-gold" /> {selectedMessage.email}
                    </a>
                    <a href={`tel:${selectedMessage.phone}`} className="flex items-center justify-end gap-2 text-text/80 hover:text-white transition-colors">
                      <MessageCircle size={14} className="text-gold" /> {selectedMessage.phone}
                    </a>
                  </div>
                </div>
              </div>
              <div className="prose prose-invert max-w-none text-text/90 whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
                {selectedMessage.phone && (
                  <a
                    href={`https://wa.me/${String(selectedMessage.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${selectedMessage.name}, suite à votre message : "${selectedMessage.subject}"`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors uppercase tracking-widest text-[10px] rounded font-bold"
                  >
                    Répondre sur WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="px-6 py-2 bg-gold/10 text-gold hover:bg-gold/20 transition-colors uppercase tracking-widest text-[10px] rounded font-bold"
                >
                  Répondre par Email
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-[50vh] text-center border border-dashed border-text/10 rounded-lg bg-white/5"
          >
            <SettingsIcon
              size={48}
              className="text-gold/50 mb-4 animate-spin-slow"
            />
            <h3 className="text-xl font-display text-text mb-2">
              Module en développement
            </h3>
            <p className="text-sm text-text/90 font-medium max-w-md ">
              Le module {activeTab} sera disponible dans la prochaine mise à
              jour de l'espace administrateur.
            </p>
          </motion.div>
        )}

        
        {activeTab === "mobilemoney" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display">Gestion Mobile Money</h2>
            </div>
            <div className="bg-glass border border-gold-muted/20 p-6 rounded-lg space-y-6">
              <h3 className="text-lg font-display text-gold">Configurer les méthodes et numéros</h3>
              
              <div>
                <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                  Méthodes Mobile Money
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {config.mobileMoneyOptions?.map(option => (
                    <div key={option} className="flex items-center gap-2 bg-navy border border-gold-muted/30 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">{option}</span>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Voulez-vous vraiment supprimer ${option} ?`)) {
                            const newOptions = config.mobileMoneyOptions.filter(o => o !== option);
                            const newAccounts = { ...config.agencyAccounts };
                            delete newAccounts[option];
                            updateConfig({ mobileMoneyOptions: newOptions, agencyAccounts: newAccounts });
                            showToast(`${option} supprimé avec succès`);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="new-mm-method"
                    placeholder="Nouvelle méthode (ex: M-Pesa)"
                    className="flex-1 bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim();
                        if (val && !config.mobileMoneyOptions.includes(val)) {
                          updateConfig({ mobileMoneyOptions: [...(config.mobileMoneyOptions || []), val] });
                          e.currentTarget.value = '';
                          showToast('Méthode ajoutée');
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('new-mm-method') as HTMLInputElement;
                      const val = input.value.trim();
                      if (val && !config.mobileMoneyOptions.includes(val)) {
                        updateConfig({ mobileMoneyOptions: [...(config.mobileMoneyOptions || []), val] });
                        input.value = '';
                        showToast('Méthode ajoutée');
                      }
                    }}
                    className="bg-gold text-navy px-4 rounded font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} /> Ajouter
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gold-muted/20">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm text-text uppercase tracking-widest">Numéros d'agence</h4>
                  <button onClick={() => showToast('Les numéros ont été enregistrés avec succès')} className="px-4 py-2 bg-glass border border-gold text-gold rounded hover:bg-gold hover:text-navy transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                    <Save size={14} /> Enregistrer
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {config.mobileMoneyOptions?.map(option => (
                    <div key={option}>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                        Numéro {option}
                      </label>
                      <input
                        type="text"
                        value={config.agencyAccounts?.[option] || ''}
                        onChange={(e) => updateConfig({
                          agencyAccounts: {
                            ...(config.agencyAccounts || {}),
                            [option]: e.target.value
                          }
                        })}
                        placeholder={`Numéro ${option}`}
                        className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gold-muted/20">
                <h4 className="text-sm text-text mb-4 uppercase tracking-widest">Image Principale du Service</h4>
                <div className="md:col-span-2">
                  {renderDropzone(
                    config.services.find((s: any) => s.id === '10')?.imageUrl || "",
                    (val: string) => {
                      const svcs = [...config.services];
                      const idx = svcs.findIndex(s => s.id === '10');
                      if(idx > -1) {
                         svcs[idx] = {...svcs[idx], imageUrl: val};
                         updateConfig({ services: svcs });
                      } else {
                         // Adding service 10 if missing
                         const newSvc = {
                           id: '10',
                           title: 'Service Mobile',
                           description: 'Consultez les numéros Mobile Money.',
                           iconName: 'CreditCard',
                           link: '/mobile-money-service',
                           imageUrl: val
                         };
                         updateConfig({ services: [...svcs, newSvc] });
                      }
                    }
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        
        {activeTab === "reviews" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-display mb-6">Avis Clients</h2>
            <div className="space-y-4">
              {(!config.reviews || config.reviews.length === 0) ? (
                <p className="text-text/50">Aucun avis pour le moment.</p>
              ) : (
                config.reviews.map((review) => (
                  <div key={review.id} className="bg-glass border border-gold-muted/20 p-6 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-bold text-text">{review.name}</h4>
                          <span className="text-[10px] bg-navy px-2 py-0.5 rounded text-gold uppercase tracking-widest">{review.service}</span>
                          <span className="text-xs text-text/50">{review.date}</span>
                          {review.status === 'pending' && (
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              En attente
                            </span>
                          )}
                          {review.status === 'approved' && (
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              Confirmé
                            </span>
                          )}
                        </div>
                        <div className="flex text-gold mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-text/20'} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.status === 'pending' && (
                          <button
                            onClick={() => {
                              showToast("Avis approuvé");
                              const updated = config.reviews?.map(r => r.id === review.id ? { ...r, status: 'approved' } : r);
                              updateConfig({ reviews: updated });
                            }}
                            className="flex items-center gap-1 p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded transition-colors text-xs font-semibold"
                            title="Approuver"
                          >
                            <CheckCircle size={16} /> Approuver
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if(window.confirm("Voulez-vous vraiment supprimer cet avis ?")) {
                              showToast("Avis supprimé");
                              const updated = config.reviews?.filter(r => r.id !== review.id);
                              updateConfig({ reviews: updated });
                            }
                          }}
                          className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-text/80">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="space-y-8 pb-20"
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              className="text-2xl font-display mb-6"
            >
              Paramètres du site
            </motion.h2>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.98 },
                show: { opacity: 1, scale: 1 },
              }}
              className="bg-glass border border-gold-muted/20 p-6 rounded-lg space-y-6"
            >
              <h3 className="text-lg font-display text-gold">
                Identité Visuelle
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Logo du site
                  </label>
                  {renderDropzone(config.logoUrl || "", (val) =>
                    updateConfig({ logoUrl: val }),
                  )}
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Image Principale (Accueil)
                  </label>
                  {renderDropzone(config.heroImageUrl, (val) =>
                    updateConfig({ heroImageUrl: val }),
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                  Titre Principal (Accueil)
                </label>
                <textarea
                  value={config.heroTitle}
                  onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                  className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold whitespace-pre-wrap"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                  Sous-titre (Accueil)
                </label>
                <textarea
                  value={config.heroSubtitle}
                  onChange={(e) =>
                    updateConfig({ heroSubtitle: e.target.value })
                  }
                  className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold whitespace-pre-wrap"
                  rows={2}
                />
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.98 },
                show: { opacity: 1, scale: 1 },
              }}
              className="bg-glass border border-gold-muted/20 p-6 rounded-lg space-y-6"
            >
              <h3 className="text-lg font-display text-gold">
                Coordonnées & Adresses
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={config.contactEmail}
                    onChange={(e) =>
                      updateConfig({ contactEmail: e.target.value })
                    }
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={config.contactWhatsapp}
                    onChange={(e) =>
                      updateConfig({ contactWhatsapp: e.target.value })
                    }
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={config.socialFacebook}
                    onChange={(e) =>
                      updateConfig({ socialFacebook: e.target.value })
                    }
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={config.socialInstagram}
                    onChange={(e) =>
                      updateConfig({ socialInstagram: e.target.value })
                    }
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    X / Twitter
                  </label>
                  <input
                    type="text"
                    value={config.socialTwitter}
                    onChange={(e) =>
                      updateConfig({ socialTwitter: e.target.value })
                    }
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    YouTube
                  </label>
                  <input
                    type="text"
                    value={config.socialYoutube}
                    onChange={(e) =>
                      updateConfig({ socialYoutube: e.target.value })
                    }
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Téléphone principal
                  </label>
                  <input
                    type="text"
                    value={config.contactPhone1}
                    onChange={(e) =>
                      updateConfig({ contactPhone1: e.target.value })
                    }
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Téléphone secondaire
                  </label>
                  <input
                    type="text"
                    value={config.contactPhone2}
                    onChange={(e) =>
                      updateConfig({ contactPhone2: e.target.value })
                    }
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Adresse physique
                  </label>
                  <textarea
                    value={config.address}
                    onChange={(e) => updateConfig({ address: e.target.value })}
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold whitespace-pre-wrap"
                    rows={2}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Heures d'ouverture
                  </label>
                  <textarea
                    value={config.workingHours}
                    onChange={(e) =>
                      updateConfig({ workingHours: e.target.value })
                    }
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold whitespace-pre-wrap"
                    rows={2}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.98 },
                show: { opacity: 1, scale: 1 },
              }}
              className="bg-glass border border-gold-muted/20 p-6 rounded-lg space-y-6"
            >
               <h3 className="text-lg font-display text-gold">
                Administrateurs (Emails)
              </h3>
              <p className="text-xs text-text/60">Séparez les emails par des virgules pour ajouter plusieurs administrateurs.</p>
              <div className="grid grid-cols-1 gap-6">
                <div>
                   <input
                    type="text"
                    value={config.admins?.join(', ') || ''}
                    onChange={(e) => {
                       const emails = e.target.value.split(',').map(email => email.trim()).filter(Boolean);
                       updateConfig({ admins: emails.length > 0 ? emails : ['mushitujacques3@gmail.com'] });
                    }}
                    placeholder="email@example.com, autre@example.com"
                    className="w-full bg-navy border border-text/20 p-3 rounded text-sm text-text focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </motion.div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => showToast("Configurations enregistrées")}
                className="px-8 py-3 bg-gold text-[#0f172a] font-semibold text-sm uppercase tracking-widest rounded hover:bg-[#d4b069]"
              >
                Enregistrer toutes les modifications
              </button>
            </div>
          </motion.div>
        )}

        
        {activeTab === "visas" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display">Gestion des Types de Visas</h2>
              
              
              <button
                onClick={() => {
                  const newTypes = [
                    ...(config.visaTypes || []),
                    { id: `visa-${Date.now()}`, name: "Nouveau Visa", price: "0$", duration: "0 jours" }
                  ];
                  updateConfig({ visaTypes: newTypes });
                  showToast("Type de visa ajouté");
                }}
                className="bg-gold px-4 py-2 text-[#0f172a] text-xs font-semibold uppercase tracking-wider rounded transition-colors hover:bg-[#d4b069]"
              >
                Ajouter un type
              </button>
            </div>
            
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden p-6 space-y-6">
              {(config.visaTypes || []).map((visa, i) => (
                <div key={visa.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-white/5 bg-navy/30 rounded relative">
                   <button onClick={() => {
                      const newTypes = config.visaTypes.filter(v => v.id !== visa.id);
                      updateConfig({ visaTypes: newTypes });
                      showToast("Type supprimé");
                   }} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                   <div>
                     <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Nom</label>
                     <input type="text" value={visa.name} onChange={(e) => {
                        const newTypes = [...config.visaTypes];
                        newTypes[i] = {...newTypes[i], name: e.target.value};
                        updateConfig({ visaTypes: newTypes });
                     }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                   </div>
                   <div>
                     <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Prix</label>
                     <input type="text" value={visa.price} onChange={(e) => {
                        const newTypes = [...config.visaTypes];
                        newTypes[i] = {...newTypes[i], price: e.target.value};
                        updateConfig({ visaTypes: newTypes });
                     }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                   </div>
                   <div>
                     <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Durée (ex: 3-5 j)</label>
                     <input type="text" value={visa.duration} onChange={(e) => {
                        const newTypes = [...config.visaTypes];
                        newTypes[i] = {...newTypes[i], duration: e.target.value};
                        updateConfig({ visaTypes: newTypes });
                     }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                   </div>
                </div>
              ))}
              {(!config.visaTypes || config.visaTypes.length === 0) && (
                <p className="text-sm text-text/60">Aucun type de visa configuré.</p>
              )}
            </div>

            <div className="flex justify-between items-center mb-6 mt-12">
               <h2 className="text-2xl font-display">Demandes de Visas (Commandes)</h2>
               <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-text/80 bg-navy-800 p-2 rounded border border-gold-muted/20">
                 <input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="accent-gold rounded" />
                 Anciennes et traitées
               </label>
            </div>
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Visa</th><th className="p-4">Statut</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {(config.orders || []).filter(o => o.item && o.item.toLowerCase().includes('visa') && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))).map(order => (
                     <React.Fragment key={order.id}>
     <tr className="border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
       <td className="p-4 text-gold">{order.id}</td>
       <td className="p-4">{order.client}</td>
       <td className="p-4">{order.item}</td>
       <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
     </tr>
     
                        {expandedOrderId === order.id && (
                          <tr className="bg-navy-800/30 border-b border-gold-muted/20">
                            <td colSpan={4} className="p-6 whitespace-normal border-t-0 p-0 m-0">
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-sm">
                                <div>
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Détails de la commande</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Article:</span> <span className="font-medium">{order.item || order.type || 'Billet/Visa'}</span></p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Montant:</span> {order.amount || order.price || 'N/A'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Date:</span> {order.date}</p>
                                   </div>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-gold-muted/10 pt-4 md:pt-0 md:pl-6">
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Informations Utilisateur</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Nom:</span> {order.client}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Téléphone:</span> {order.phone || 'Non renseigné'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Email:</span> {order.email || 'Non renseigné'}</p>
                                   </div>
                                   <div className="flex gap-3 mt-4">
                                     {order.phone && (
                                       <a href={`https://wa.me/${String(order.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         WhatsApp
                                       </a>
                                     )}
                                     {order.email && (
                                       <a href={`mailto:${order.email}`} onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         Email
                                       </a>
                                     )} {order.status !== "Terminé" && (<button onClick={(e) => { e.stopPropagation(); showToast("Statut mis à jour"); const isTransfer = order.id?.startsWith("#TR"); const prop = isTransfer ? "transfers" : "orders"; const updated = (config[prop] || []).map(o => o.id === order.id ? { ...o, status: "Terminé", statusColor: "text-green-400 bg-green-500/20 border-green-500/40 font-semibold" } : o); updateConfig({ [prop]: updated }); }} className="flex-1 flex justify-center py-2 items-center bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-navy rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">Terminer</button>)}
                                   </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
   </React.Fragment>
                   ))}
                 </tbody>
               </table>
            </div>
          </motion.div>
        )}


        
        {activeTab === "flights" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
      <h2 className="text-2xl font-display">Gestion Billets d'avion</h2>
   </div>
   
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden p-6 mb-8 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
               {(config.services || []).filter(s => s.id === '1').map(svc => (
                  <React.Fragment key={svc.id}>
                    <div>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Titre du service</label>
                      <input type="text" value={svc.title} onChange={(e) => {
                         const svcs = [...config.services];
                         const idx = svcs.findIndex(s => s.id === '1');
                         if(idx > -1) { svcs[idx] = {...svcs[idx], title: e.target.value}; updateConfig({ services: svcs }); }
                      }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                    </div>
                    <div>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Description (Aperçu)</label>
                      <input type="text" value={svc.description} onChange={(e) => {
                         const svcs = [...config.services];
                         const idx = svcs.findIndex(s => s.id === '1');
                         if(idx > -1) { svcs[idx] = {...svcs[idx], description: e.target.value}; updateConfig({ services: svcs }); }
                      }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Bannière / Image</label>
                       {renderDropzone(svc.imageUrl || "", (val) => {
                          const svcs = [...config.services];
                          const idx = svcs.findIndex(s => s.id === '1');
                          if(idx > -1) { svcs[idx] = {...svcs[idx], imageUrl: val}; updateConfig({ services: svcs }); }
                       })}
                    </div>
                  </React.Fragment>
               ))}
            </div>

   <div className="flex justify-between items-center mb-6 mt-8">
               <h2 className="text-xl font-display">Demandes de Billets</h2>
               <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-text/80 bg-navy-800 p-2 rounded border border-gold-muted/20">
                 <input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="accent-gold rounded" />
                 Anciennes et traitées
               </label>
            </div>
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Billet</th><th className="p-4">Statut</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {(config.orders || []).filter(o => o.item && (o.item.toLowerCase().includes('billet') || o.item.toLowerCase().includes('vol')) && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))).map(order => (
                     <React.Fragment key={order.id}>
     <tr className="border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
       <td className="p-4 text-gold">{order.id}</td>
       <td className="p-4">{order.client}</td>
       <td className="p-4">{order.item}</td>
       <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
     </tr>
     
                        {expandedOrderId === order.id && (
                          <tr className="bg-navy-800/30 border-b border-gold-muted/20">
                            <td colSpan={4} className="p-6 whitespace-normal border-t-0 p-0 m-0">
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-sm">
                                <div>
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Détails de la commande</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Article:</span> <span className="font-medium">{order.item || order.type || 'Billet/Visa'}</span></p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Montant:</span> {order.amount || order.price || 'N/A'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Date:</span> {order.date}</p>
                                   </div>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-gold-muted/10 pt-4 md:pt-0 md:pl-6">
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Informations Utilisateur</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Nom:</span> {order.client}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Téléphone:</span> {order.phone || 'Non renseigné'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Email:</span> {order.email || 'Non renseigné'}</p>
                                   </div>
                                   <div className="flex gap-3 mt-4">
                                     {order.phone && (
                                       <a href={`https://wa.me/${String(order.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         WhatsApp
                                       </a>
                                     )}
                                     {order.email && (
                                       <a href={`mailto:${order.email}`} onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         Email
                                       </a>
                                     )} {order.status !== "Terminé" && (<button onClick={(e) => { e.stopPropagation(); showToast("Statut mis à jour"); const isTransfer = order.id?.startsWith("#TR"); const prop = isTransfer ? "transfers" : "orders"; const updated = (config[prop] || []).map(o => o.id === order.id ? { ...o, status: "Terminé", statusColor: "text-green-400 bg-green-500/20 border-green-500/40 font-semibold" } : o); updateConfig({ [prop]: updated }); }} className="flex-1 flex justify-center py-2 items-center bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-navy rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">Terminer</button>)}
                                   </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
   </React.Fragment>
                   ))}
                 </tbody>
               </table>
            </div>
          </motion.div>
        )}


        {activeTab === "hotels" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
      <h2 className="text-2xl font-display">Gestion Réservation d'hôtel</h2>
              
   </div>
   
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden p-6 mb-8 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
               {(config.services || []).filter(s => s.id === '6').map(svc => (
                  <React.Fragment key={svc.id}>
                    <div>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Titre du service</label>
                      <input type="text" value={svc.title} onChange={(e) => {
                         const svcs = [...config.services];
                         const idx = svcs.findIndex(s => s.id === '6');
                         if(idx > -1) { svcs[idx] = {...svcs[idx], title: e.target.value}; updateConfig({ services: svcs }); }
                      }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                    </div>
                    <div>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Description (Aperçu)</label>
                      <input type="text" value={svc.description} onChange={(e) => {
                         const svcs = [...config.services];
                         const idx = svcs.findIndex(s => s.id === '6');
                         if(idx > -1) { svcs[idx] = {...svcs[idx], description: e.target.value}; updateConfig({ services: svcs }); }
                      }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Bannière / Image</label>
                       {renderDropzone(svc.imageUrl || "", (val) => {
                          const svcs = [...config.services];
                          const idx = svcs.findIndex(s => s.id === '6');
                          if(idx > -1) { svcs[idx] = {...svcs[idx], imageUrl: val}; updateConfig({ services: svcs }); }
                       })}
                    </div>
                  </React.Fragment>
               ))}
            </div>

   <div className="flex justify-between items-center mb-6 mt-8">
               <h2 className="text-xl font-display">Demandes Réservation</h2>
               <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-text/80 bg-navy-800 p-2 rounded border border-gold-muted/20">
                 <input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="accent-gold rounded" />
                 Anciennes et traitées
               </label>
            </div>
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Hôtel</th><th className="p-4">Statut</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {(config.orders || []).filter(o => o.item && o.item.toLowerCase().includes('hôtel') && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))).map(order => (
                     <React.Fragment key={order.id}>
     <tr className="border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
       <td className="p-4 text-gold">{order.id}</td>
       <td className="p-4">{order.client}</td>
       <td className="p-4">{order.item}</td>
       <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
     </tr>
     
                        {expandedOrderId === order.id && (
                          <tr className="bg-navy-800/30 border-b border-gold-muted/20">
                            <td colSpan={4} className="p-6 whitespace-normal border-t-0 p-0 m-0">
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-sm">
                                <div>
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Détails de la commande</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Article:</span> <span className="font-medium">{order.item || order.type || 'Billet/Visa'}</span></p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Montant:</span> {order.amount || order.price || 'N/A'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Date:</span> {order.date}</p>
                                   </div>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-gold-muted/10 pt-4 md:pt-0 md:pl-6">
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Informations Utilisateur</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Nom:</span> {order.client}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Téléphone:</span> {order.phone || 'Non renseigné'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Email:</span> {order.email || 'Non renseigné'}</p>
                                   </div>
                                   <div className="flex gap-3 mt-4">
                                     {order.phone && (
                                       <a href={`https://wa.me/${String(order.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         WhatsApp
                                       </a>
                                     )}
                                     {order.email && (
                                       <a href={`mailto:${order.email}`} onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         Email
                                       </a>
                                     )} {order.status !== "Terminé" && (<button onClick={(e) => { e.stopPropagation(); showToast("Statut mis à jour"); const isTransfer = order.id?.startsWith("#TR"); const prop = isTransfer ? "transfers" : "orders"; const updated = (config[prop] || []).map(o => o.id === order.id ? { ...o, status: "Terminé", statusColor: "text-green-400 bg-green-500/20 border-green-500/40 font-semibold" } : o); updateConfig({ [prop]: updated }); }} className="flex-1 flex justify-center py-2 items-center bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-navy rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">Terminer</button>)}
                                   </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
   </React.Fragment>
                   ))}
                 </tbody>
               </table>
            </div>
          </motion.div>
        )}

        
        {activeTab === "cargo" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display">Gestion Service Cargo</h2>
              
            </div>
            
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden p-6 mb-8 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
               {(config.services || []).filter(s => s.id === '9').map(svc => (
                  <React.Fragment key={svc.id}>
                    <div>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Titre du service</label>
                      <input type="text" value={svc.title} onChange={(e) => {
                         const svcs = [...config.services];
                         const idx = svcs.findIndex(s => s.id === '9');
                         if(idx > -1) { svcs[idx] = {...svcs[idx], title: e.target.value}; updateConfig({ services: svcs }); }
                      }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                    </div>
                    <div>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Description (Aperçu)</label>
                      <input type="text" value={svc.description} onChange={(e) => {
                         const svcs = [...config.services];
                         const idx = svcs.findIndex(s => s.id === '9');
                         if(idx > -1) { svcs[idx] = {...svcs[idx], description: e.target.value}; updateConfig({ services: svcs }); }
                      }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Bannière / Image</label>
                       {renderDropzone(svc.imageUrl || "", (val) => {
                          const svcs = [...config.services];
                          const idx = svcs.findIndex(s => s.id === '9');
                          if(idx > -1) { svcs[idx] = {...svcs[idx], imageUrl: val}; updateConfig({ services: svcs }); }
                       })}
                    </div>
                  </React.Fragment>
               ))}
            </div>

            <div className="flex justify-between items-center mb-6 mt-8">
               <h2 className="text-xl font-display">Demandes Cargo</h2>
               <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-text/80 bg-navy-800 p-2 rounded border border-gold-muted/20">
                 <input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="accent-gold rounded" />
                 Anciennes et traitées
               </label>
            </div>
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Demande</th><th className="p-4">Statut</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {(config.orders || []).filter(o => o.item && o.item.toLowerCase().includes('cargo') && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))).map(order => (
                     <React.Fragment key={order.id}>
                       <tr className="border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                         <td className="p-4 text-gold">{order.id}</td>
                         <td className="p-4">{order.client}</td>
                         <td className="p-4">{order.item}</td>
                         <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
                       </tr>
                       
                        {expandedOrderId === order.id && (
                          <tr className="bg-navy-800/30 border-b border-gold-muted/20">
                            <td colSpan={4} className="p-6 whitespace-normal border-t-0 p-0 m-0">
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-sm">
                                <div>
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Détails de la commande</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Article:</span> <span className="font-medium">{order.item || order.type || 'Billet/Visa'}</span></p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Montant:</span> {order.amount || order.price || 'N/A'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Date:</span> {order.date}</p>
                                   </div>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-gold-muted/10 pt-4 md:pt-0 md:pl-6">
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Informations Utilisateur</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Nom:</span> {order.client}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Téléphone:</span> {order.phone || 'Non renseigné'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Email:</span> {order.email || 'Non renseigné'}</p>
                                   </div>
                                   <div className="flex gap-3 mt-4">
                                     {order.phone && (
                                       <a href={`https://wa.me/${String(order.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         WhatsApp
                                       </a>
                                     )}
                                     {order.email && (
                                       <a href={`mailto:${order.email}`} onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         Email
                                       </a>
                                     )} {order.status !== "Terminé" && (<button onClick={(e) => { e.stopPropagation(); showToast("Statut mis à jour"); const isTransfer = order.id?.startsWith("#TR"); const prop = isTransfer ? "transfers" : "orders"; const updated = (config[prop] || []).map(o => o.id === order.id ? { ...o, status: "Terminé", statusColor: "text-green-400 bg-green-500/20 border-green-500/40 font-semibold" } : o); updateConfig({ [prop]: updated }); }} className="flex-1 flex justify-center py-2 items-center bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-navy rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">Terminer</button>)}
                                   </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                     </React.Fragment>
                   ))}
                 </tbody>
               </table>
            </div>
          </motion.div>
        )}

        {activeTab === "services" && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-light text-text">
                Gestion des Services
              </h1>
            </div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.98 },
                show: { opacity: 1, scale: 1 },
              }}
              className="bg-glass border border-gold-muted/20 p-6 rounded-lg space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display text-gold">
                  Services affichés à l'accueil
                </h3>
                <button
                  onClick={() => {
                    const newId = Date.now().toString();
                    updateConfig({
                      services: [
                        ...config.services,
                        {
                          id: newId,
                          title: "Nouveau",
                          description: "",
                          iconName: "Star",
                          link: `/services/${newId}`,
                        },
                      ],
                    });
                  }}
                  className="text-[10px] px-3 py-1.5 border border-gold text-gold hover:bg-gold/10 rounded uppercase tracking-wider"
                >
                  + Ajouter
                </button>
              </div>
              <div className="space-y-4">
                {(config.services || []).map((svc, i) => (
                  <div
                    key={svc.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 border border-white/10 p-4 relative group rounded"
                  >
                    <div className="md:col-span-3">
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">
                        Titre
                      </label>
                      <input
                        value={svc.title}
                        onChange={(e) => {
                          const svcs = [...config.services];
                          svcs[i] = { ...svcs[i], title: e.target.value };
                          updateConfig({ services: svcs });
                        }}
                        className="w-full bg-navy border border-text/20 px-2 py-1.5 rounded text-xs text-text focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">
                        Description brève (Accueil)
                      </label>
                      <input
                        value={svc.description}
                        onChange={(e) => {
                          const svcs = [...config.services];
                          svcs[i] = { ...svcs[i], description: e.target.value };
                          updateConfig({ services: svcs });
                        }}
                        placeholder="Ex: Obtention rapide de visa..."
                        className="w-full bg-navy border border-text/20 px-2 py-1.5 rounded text-xs text-text focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">
                        Icône
                      </label>
                      <select
                        value={svc.iconName}
                        onChange={(e) => {
                          const svcs = [...config.services];
                          svcs[i] = { ...svcs[i], iconName: e.target.value };
                          updateConfig({ services: svcs });
                        }}
                        className="w-full bg-navy border border-text/20 px-2 py-1.5 rounded text-xs text-text focus:outline-none focus:border-gold"
                      >
                        <option value="Star">Etoile</option>
                        <option value="Plane">Avion</option>
                        <option value="FileText">Document</option>
                        <option value="ShoppingBag">Boutique</option>
                        <option value="Car">Voiture</option>
                        <option value="Building2">Bâtiment</option>
                        <option value="ShieldCheck">Bouclier</option>
                        <option value="CreditCard">Carte Financière</option>
                        <option value="Package">Colis/Cargo</option>
                        <option value="RefreshCcw">Renouvellement</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">
                        Lien (Auto)
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={svc.link}
                          readOnly
                          className="w-full bg-navy border border-text/20 px-2 py-1.5 rounded text-xs text-text/50 focus:outline-none cursor-not-allowed"
                        />
                        <button
                          onClick={() => {
                            const svcs = config.services.filter(
                              (s) => s.id !== svc.id,
                            );
                            updateConfig({ services: svcs });
                          }}
                          className="p-1.5 text-red-400 hover:bg-red-400/20 rounded border border-red-400/30"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-12 mt-2">
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">
                        Détails complets de la page (Visible au clic)
                      </label>
                      <textarea
                        value={svc.content || ''}
                        onChange={(e) => {
                          const svcs = [...config.services];
                          svcs[i] = { ...svcs[i], content: e.target.value };
                          updateConfig({ services: svcs });
                        }}
                        rows={4}
                        placeholder="Contenu détaillé qui sera visible lorsque le client cliquera sur ce service..."
                        className="w-full bg-navy border border-text/20 px-2 py-1.5 rounded text-xs text-text focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="md:col-span-12 mt-2">
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">
                        Image de couverture (Télécharger)
                      </label>
                      {renderDropzone(svc.imageUrl || "", (val) => {
                        const svcs = [...config.services];
                        svcs[i] = { ...svcs[i], imageUrl: val };
                        updateConfig({ services: svcs });
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => showToast("Services enregistrés")}
                className="px-8 py-3 bg-gold text-[#0f172a] font-semibold text-sm uppercase tracking-widest rounded hover:bg-[#d4b069]"
              >
                Enregistrer les services
              </button>
            </div>
          </motion.div>
        )}

        {/* Edit Product Modal */}
        <AnimatePresence>
          {editProductId !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#334155]/70 backdrop-blur-sm dark-glass-text"
              onClick={() => setEditProductId(null)}
            >
              <div
                className="bg-navy-800 border border-gold/30 p-6 rounded-lg shadow-2xl max-w-sm w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setEditProductId(null)}
                  className="absolute top-4 right-4 text-text/90 font-medium hover:text-text"
                >
                  <X size={18} />
                </button>
                <h3 className="text-xl font-display mb-4 text-text">
                  Modifier le produit
                </h3>
                <div className="mb-4">
                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                    Nouveau prix
                  </label>
                  <input
                    type="text"
                    value={editProductPrice}
                    onChange={(e) => setEditProductPrice(e.target.value)}
                    className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                  />
                </div>
                <button
                  onClick={saveProductPrice}
                  className="w-full py-2 bg-gold text-[#0f172a] font-semibold text-xs uppercase tracking-wider rounded transition-colors hover:bg-[#c4a059]"
                >
                  Enregistrer modifications
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Toast */}
        <AnimatePresence>
          {toast.visible && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 20, x: "-50%" }}
              className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 bg-[#334155]/70 backdrop-blur-lg border border-gold/30 px-6 py-3 rounded-full shadow-2xl"
            >
              <CheckCircle2 size={16} className="text-gold" />
              <span className="text-sm font-medium text-text">
                {toast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedClientName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm p-4"
            >
              {(() => {
                const clientOrders = orders.filter(o => o.client === selectedClientName);
                const lastOrderWithContact = clientOrders.find(o => o.phone || o.email) || clientOrders[0];
                return (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-glass border border-gold-muted/30 p-6 sm:p-8 rounded-xl max-w-2xl w-full text-text relative max-h-[90vh] overflow-y-auto"
                  >
                    <button 
                      onClick={() => setSelectedClientName(null)}
                      className="absolute top-4 right-4 text-text/60 hover:text-gold transition-colors z-10"
                    >
                      <X size={20} />
                    </button>
                    <h2 className="text-2xl font-display mb-2">{selectedClientName}</h2>
              
                    <p className="text-sm text-text/70 mb-6 uppercase tracking-widest">Informations Client</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-navy-800/50 p-4 rounded border border-gold-muted/10">
                        <span className="text-[10px] uppercase text-text/50 font-bold tracking-widest block mb-1">Téléphone</span>
                        <span className="text-sm font-medium">{lastOrderWithContact?.phone || "+243 00 000 00 00"}</span>
                      </div>
                      <div className="bg-navy-800/50 p-4 rounded border border-gold-muted/10">
                        <span className="text-[10px] uppercase text-text/50 font-bold tracking-widest block mb-1">Email</span>
                        <span className="text-sm font-medium">{lastOrderWithContact?.email || `${String(selectedClientName).toLowerCase().replace(' ', '.')}@email.com`}</span>
                      </div>
                    </div>

                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-4 border-b border-gold/20 pb-2">Historique des Commandes</h3>
                    <div className="space-y-3">
                      {clientOrders.map(o => (
                        <div key={o.id} className="flex justify-between items-center bg-navy/30 p-3 rounded border border-gold-muted/5 group hover:border-gold/20 transition-colors">
                          <div>
                            <span className="block text-xs font-bold text-text mb-1">{o.item}</span>
                        <span className="text-[10px] text-text/60">{o.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-gold mb-1">{o.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold ${o.statusColor}`}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
