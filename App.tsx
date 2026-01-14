
import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, Tab } from './types';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { ICONS } from './constants';

const LOCAL_STORAGE_KEY = 'bed_and_home_orders_v5';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const showNotification = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleSaveOrder = (newOrderData: any) => {
    const newId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const now = new Date().toISOString();
    
    const newOrder: Order = {
      ...newOrderData,
      id: newId,
      date: now,
      status: OrderStatus.PENDIENTE,
      history: [{ status: OrderStatus.PENDIENTE, timestamp: now }]
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveTab('list');
    showNotification(`Pedido #${newId} creado con éxito`);
  };

  const handleUpdateOrder = (id: string, updatedData: any) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          ...updatedData,
          // If we change any data that affects price, we've already calculated totalAmount in the form
        };
      }
      return order;
    }));
    showNotification(`Pedido #${id} actualizado correctamente`);
  };

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        if (order.status === newStatus) return order;
        return {
          ...order,
          status: newStatus,
          history: [...order.history, { status: newStatus, timestamp: new Date().toISOString() }]
        };
      }
      return order;
    }));
    showNotification(`Estado de #${id} actualizado a ${newStatus}`, 'info');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Fecha', 'Vendedor', 'Cliente', 'Pago', 'Total $', 'Estado', 'Nota Especial'];
    const rows = orders.map(o => [
      o.id,
      new Date(o.date).toLocaleString(),
      o.salesPerson,
      o.customerName,
      o.paymentMethod,
      o.totalAmount,
      o.status,
      o.specialDescription || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bed_and_home_pedidos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0 font-sans">
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-lg">
               <img src="https://bedandhome.com.ec/wp-content/uploads/2021/07/LOGO-BED-HOME-01.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-800 leading-none tracking-tighter uppercase">BED & HOME</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Admin Dashboard</p>
            </div>
          </div>
          <nav className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            <button onClick={() => setActiveTab('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{ICONS.LIST} <span className="hidden sm:inline">LISTADO</span></button>
            <button onClick={() => setActiveTab('new')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'new' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{ICONS.PLUS} <span className="hidden sm:inline">NUEVO</span></button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {activeTab === 'new' ? (
          <OrderForm onSave={handleSaveOrder} />
        ) : (
          <OrderList 
            orders={orders} 
            onStatusChange={handleUpdateStatus} 
            onUpdateOrder={handleUpdateOrder}
            onExport={handleExportCSV} 
          />
        )}
      </main>

      {notification && (
        <div className="fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl bg-indigo-950 text-white border border-indigo-800 z-50 animate-in slide-in-from-bottom-5">
          <span className="text-sm font-bold uppercase">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;
