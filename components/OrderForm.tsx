
import React, { useState, useEffect } from 'react';
import { Order, OrderItem, PaymentMethod } from '../types';

interface OrderFormProps {
  onSave: (order: any) => void;
  initialData?: Order | null;
  onCancel?: () => void;
}

const USERS: Record<string, string> = {
  'NICOLE': '12345NICOLE',
  'KEVIN': '12345KEVIN',
  'WANDA': '12345WANDA',
  'GENESIS': '12345GENESIS',
  'LUIS': '12345LUIS'
};

const PRODUCT_TYPES = [
  'Sabana Premium', 'Sabana Bramante', 'Sabana VIP', 
  'Cobertor Velvet Sherpa', 'Cobertor Español', 'Almohada', 
  'Fundas de Almohada', 'Protectores de Sofá', 'Rellenos Nórdicos', 'Coverduvet'
];

const STANDARD_SIZES = ['Twin', 'Full', 'Queen', 'King'];
const PILLOW_SIZES = ['70x50', '90x50'];
const SOFA_SIZES = ['1 Puesto', '2 Puestos', '3 Puestos'];
const PILLOW_MATERIALS = ['Bramante', 'Acolchada'];
const FILLING_TYPES = ['Duvet Tacto Pluma', 'Relleno Delgado', 'Relleno Grueso'];

export const OrderForm: React.FC<OrderFormProps> = ({ onSave, initialData, onCancel }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(initialData?.salesPerson || null);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState('');

  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    location: initialData?.location || '',
    idCard: initialData?.idCard || '',
    whatsapp: initialData?.whatsapp || '',
    email: initialData?.email || '',
    wantsInvoice: initialData?.wantsInvoice || false,
    paymentMethod: (initialData?.paymentMethod || 'Efectivo') as PaymentMethod,
    specialDescription: initialData?.specialDescription || '',
  });

  const [items, setItems] = useState<OrderItem[]>(
    initialData?.items || [{ productType: PRODUCT_TYPES[0], size: STANDARD_SIZES[0], color: '', price: 0, quantity: 1 }]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (USERS[loginForm.user] === loginForm.pass) {
      setCurrentUser(loginForm.user);
      setLoginError('');
    } else {
      setLoginError('Usuario o clave incorrecta');
    }
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
    return formData.paymentMethod === 'Tarjeta de Crédito' ? subtotal * 1.08 : subtotal;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Requerido';
    if (!formData.location.trim()) newErrors.location = 'Requerido';
    if (!formData.idCard.trim()) newErrors.idCard = 'Requerido';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({ 
        ...formData, 
        items, 
        totalAmount: calculateTotal(),
        salesPerson: currentUser || 'Desconocido'
      });
      if (!initialData) {
        setFormData({ customerName: '', location: '', idCard: '', whatsapp: '', email: '', wantsInvoice: false, paymentMethod: 'Efectivo', specialDescription: '' });
        setItems([{ productType: PRODUCT_TYPES[0], size: STANDARD_SIZES[0], color: '', price: 0, quantity: 1 }]);
        setCurrentUser(null);
      }
    }
  };

  if (!currentUser && !initialData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 uppercase">Acceso Vendedor</h2>
            <p className="text-sm text-slate-500">BED & HOME</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <select className="w-full p-3 border border-slate-300 rounded-xl bg-white" value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})}>
              <option value="">Seleccionar Vendedor...</option>
              {Object.keys(USERS).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <input type="password" placeholder="Clave..." className="w-full p-3 border border-slate-300 rounded-xl bg-white" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})} />
            {loginError && <p className="text-rose-500 text-xs font-bold text-center">{loginError}</p>}
            <button className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl">INGRESAR</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-4xl mx-auto animate-in fade-in">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold">{initialData ? 'Editar Pedido' : 'Registrar Pedido'}</h2>
          <p className="text-xs font-bold text-indigo-600 uppercase">Vendedor: {currentUser}</p>
        </div>
        {onCancel && <button type="button" onClick={onCancel} className="text-xs bg-slate-100 px-4 py-2 rounded-full font-bold">CANCELAR</button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Nombre del Cliente *</label>
          <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg bg-white" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Cédula *</label>
          <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg bg-white" value={formData.idCard} onChange={e => setFormData({...formData, idCard: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">WhatsApp *</label>
          <input type="tel" className="w-full p-2.5 border border-slate-300 rounded-lg bg-white" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Ubicación *</label>
          <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg bg-white" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
        </div>
        
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold mb-1">Forma de Pago</label>
          <select className="w-full p-2.5 border border-slate-300 rounded-lg font-bold bg-white" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value as PaymentMethod})}>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Tarjeta de Crédito">Tarjeta de Crédito (+8%)</option>
          </select>
        </div>

        <div className="md:col-span-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="wantsInvoice" checked={formData.wantsInvoice} onChange={e => setFormData({...formData, wantsInvoice: e.target.checked})} />
            <label htmlFor="wantsInvoice" className="text-xs font-bold uppercase">¿Factura?</label>
          </div>
          {formData.wantsInvoice && <input type="email" className="w-full mt-2 p-2 border border-slate-300 rounded text-sm bg-white" placeholder="Email..." value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-indigo-600 uppercase mb-1">Descripción Pedido Especial</label>
          <textarea 
            className="w-full p-3 border border-indigo-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
            placeholder="Ej: Bordado especial, medidas personalizadas, envolver para regalo..."
            rows={2}
            value={formData.specialDescription}
            onChange={e => setFormData({...formData, specialDescription: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-sm font-black uppercase">Detalle de Productos</h3>
          <button type="button" onClick={() => setItems([...items, { productType: PRODUCT_TYPES[0], size: STANDARD_SIZES[0], color: '', price: 0, quantity: 1 }])} className="text-indigo-600 text-sm font-bold">+ Agregar</button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl relative space-y-4 shadow-sm">
             {items.length > 1 && <button type="button" onClick={() => setItems(items.filter((_, i) => i !== index))} className="absolute top-2 right-2 text-rose-500 font-bold">×</button>}
             <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400">PRODUCTO</label>
                  <select className="w-full p-2 border border-slate-300 rounded bg-white text-sm" value={item.productType} onChange={e => {
                    const ni = [...items]; ni[index].productType = e.target.value; 
                    ni[index].size = (e.target.value === 'Almohada' || e.target.value === 'Fundas de Almohada') ? PILLOW_SIZES[0] : STANDARD_SIZES[0];
                    setItems(ni);
                  }}>
                    {PRODUCT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">TAMAÑO</label>
                  <select className="w-full p-2 border border-slate-300 rounded bg-white text-sm" value={item.size} onChange={e => { const ni = [...items]; ni[index].size = e.target.value; setItems(ni); }}>
                    {item.productType === 'Almohada' || item.productType === 'Fundas de Almohada' ? PILLOW_SIZES.map(s => <option key={s} value={s}>{s}</option>) :
                     item.productType === 'Protectores de Sofá' ? SOFA_SIZES.map(s => <option key={s} value={s}>{s}</option>) :
                     STANDARD_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">CANT.</label>
                  <input type="number" min="1" className="w-full p-2 border border-slate-300 rounded bg-white text-sm" value={item.quantity} onChange={e => { const ni = [...items]; ni[index].quantity = Number(e.target.value); setItems(ni); }} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400">PRECIO UNIT $</label>
                  <input type="number" className="w-full p-2 border border-slate-300 rounded bg-white text-sm" value={item.price} onChange={e => { const ni = [...items]; ni[index].price = Number(e.target.value); setItems(ni); }} />
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">COLOR</label>
                  <input type="text" className="w-full p-2 border border-slate-300 rounded bg-white text-sm" value={item.color} onChange={e => { const ni = [...items]; ni[index].color = e.target.value; setItems(ni); }} />
                </div>
                {item.productType === 'Almohada' && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">MATERIAL</label>
                    <select className="w-full p-2 border border-slate-300 rounded bg-white text-sm" value={item.material || ''} onChange={e => { const ni = [...items]; ni[index].material = e.target.value; setItems(ni); }}>
                      <option value="">Seleccionar...</option>{PILLOW_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                )}
             </div>
          </div>
        ))}

        <div className="p-4 bg-indigo-50 rounded-xl border-2 border-indigo-100">
          <div className="flex justify-between items-center text-indigo-900 font-bold">
            <span>TOTAL FINAL:</span>
            <span className="text-3xl font-black text-indigo-600">${calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all uppercase tracking-widest">
        {initialData ? 'ACTUALIZAR PEDIDO' : 'GUARDAR PEDIDO'}
      </button>
    </form>
  );
};
