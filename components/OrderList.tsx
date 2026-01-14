
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { ICONS } from '../constants';
import { OrderForm } from './OrderForm';

interface OrderListProps {
  orders: Order[];
  onStatusChange: (id: string, newStatus: OrderStatus) => void;
  onUpdateOrder: (id: string, updatedData: any) => void;
  onExport: () => void;
}

const SALESPERSONS = ['NICOLE', 'KEVIN', 'WANDA', 'GENESIS', 'LUIS'];

export const OrderList: React.FC<OrderListProps> = ({ orders, onStatusChange, onUpdateOrder, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [salesPersonFilter, setSalesPersonFilter] = useState<string | 'ALL'>('ALL');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const filteredOrders = orders
    .filter(order => {
      const searchStr = `${order.customerName} ${order.idCard} ${order.id} ${order.salesPerson} ${order.items.map(i => i.productType).join(' ')}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchesSalesPerson = salesPersonFilter === 'ALL' || order.salesPerson === salesPersonFilter;
      return matchesSearch && matchesStatus && matchesSalesPerson;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (editingOrderId) {
    const orderToEdit = orders.find(o => o.id === editingOrderId);
    return (
      <OrderForm 
        initialData={orderToEdit} 
        onSave={(data) => {
          onUpdateOrder(editingOrderId, data);
          setEditingOrderId(null);
        }}
        onCancel={() => setEditingOrderId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">{ICONS.SEARCH}</div>
            <input
              type="text"
              placeholder="Buscar cliente, vendedor o ID..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={onExport} className="bg-slate-900 text-white px-5 py-2 rounded-lg text-xs font-black uppercase flex items-center gap-2 hover:bg-black transition-colors w-full md:w-auto justify-center">
            {ICONS.DOWNLOAD} Exportar CSV
          </button>
        </div>

        <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-slate-50">
          <select className="p-2 border border-slate-300 rounded-lg text-xs font-bold bg-white" value={salesPersonFilter} onChange={e => setSalesPersonFilter(e.target.value)}>
            <option value="ALL">TODOS LOS VENDEDORES</option>
            {SALESPERSONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="p-2 border border-slate-300 rounded-lg text-xs font-bold bg-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
            <option value="ALL">TODOS LOS ESTADOS</option>
            {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No se encontraron pedidos</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 flex flex-col md:flex-row justify-between gap-4 border-b bg-white">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100 uppercase">#{order.id}</span>
                    <StatusBadge status={order.status} size="sm" />
                    <button 
                      onClick={() => setEditingOrderId(order.id)}
                      className="ml-auto md:ml-2 text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded uppercase flex items-center gap-1 hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      EDITAR
                    </button>
                  </div>
                  <h3 className="font-black text-slate-900 text-2xl tracking-tight">{order.customerName}</h3>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-500 mt-3 font-bold uppercase tracking-wider items-center">
                    <span className="bg-indigo-50 px-2 py-1 rounded text-indigo-700 border border-indigo-100">VEN: {order.salesPerson}</span>
                    <span className="bg-emerald-50 px-2 py-1 rounded text-emerald-700 border border-emerald-100">WA: {order.whatsapp}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                   <div className="text-3xl font-black text-slate-900 leading-none">${order.totalAmount.toLocaleString()}</div>
                   <select 
                      className="mt-4 text-[11px] font-black border border-slate-300 rounded-xl p-2.5 bg-white uppercase cursor-pointer shadow-sm" 
                      value={order.status} 
                      onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                    >
                      {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
              </div>
              
              <div className="px-5 py-6 bg-slate-50/40">
                {order.specialDescription && (
                  <div className="mb-4 p-3 bg-white border border-amber-200 rounded-xl shadow-sm">
                    <h5 className="text-[9px] font-black text-amber-600 uppercase mb-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      Nota Especial
                    </h5>
                    <p className="text-xs font-bold text-amber-900 leading-relaxed italic">"{order.specialDescription}"</p>
                  </div>
                )}

                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Detalle del Pedido</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-black text-indigo-700 uppercase text-xs">{item.productType}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase">Cant: {item.quantity}</span>
                      </div>
                      <div className="text-[11px] font-bold space-y-1">
                        <div className="flex justify-between border-b border-slate-50 pb-1"><span>Size:</span><span>{item.size}</span></div>
                        <div className="flex justify-between border-b border-slate-50 pb-1"><span>Color:</span><span>{item.color}</span></div>
                        <div className="flex justify-end pt-1"><span className="text-indigo-600 font-black">${(item.price * item.quantity).toLocaleString()}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-500 uppercase flex justify-between items-center">
                  <span>Entrega: <span className="text-slate-900">{order.location}</span></span>
                  <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-slate-900 font-black shadow-sm">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
