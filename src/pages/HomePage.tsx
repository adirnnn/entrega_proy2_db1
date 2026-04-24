import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [clients, setClients] = useState([]);
  const [reports, setReports] = useState({
    topCategories: [],
    soldProducts: [],
    activeClients: [],
    employeeSales: [],
  });
  const [newProduct, setNewProduct] = useState({
    nombre: '', categoria: '', precio: 0, stock: 0, id_proveedor: 1
  });
  const [newClient, setNewClient] = useState({
    nombre: '', correo: '', telefono: ''
  });
  const [error, setError] = useState('');

  const fetchData = () => {
    fetch('http://localhost:3000/products').then(res => res.json()).then(setProducts).catch(e => setError('Error cargando productos'));
    fetch('http://localhost:3000/providers').then(res => res.json()).then(setProviders);
    fetch('http://localhost:3000/clients').then(res => res.json()).then(setClients);
    fetch('http://localhost:3000/reports/top-categories').then(r => r.json()).then(d => setReports(prev => ({...prev, topCategories: d})));
    fetch('http://localhost:3000/reports/sold-products').then(r => r.json()).then(d => setReports(prev => ({...prev, soldProducts: d})));
    fetch('http://localhost:3000/reports/active-clients').then(r => r.json()).then(d => setReports(prev => ({...prev, activeClients: d})));
    fetch('http://localhost:3000/reports/employee-sales').then(r => r.json()).then(d => setReports(prev => ({...prev, employeeSales: d})));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = (e: any) => {
    e.preventDefault();
    fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).then(res => {
      if(!res.ok) throw new Error('Error al crear producto');
      fetchData();
      setNewProduct({ nombre: '', categoria: '', precio: 0, stock: 0, id_proveedor: 1 });
      setError('');
    }).catch(err => setError(err.message));
  };

  const handleCreateClient = (e: any) => {
    e.preventDefault();
    fetch('http://localhost:3000/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    }).then(res => {
      if(!res.ok) throw new Error('Error al crear cliente');
      fetchData();
      setNewClient({ nombre: '', correo: '', telefono: '' });
      setError('');
    }).catch(err => setError(err.message));
  };

  const handleDelete = (type: string, id: number) => {
    fetch(`http://localhost:3000/${type}/${id}`, { method: 'DELETE' })
      .then(res => {
        if(!res.ok) throw new Error('No se puede eliminar (registros relacionados)');
        fetchData();
        setError('');
      })
      .catch(err => setError(err.message));
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Empleado', 'Puesto', 'Total Ventas', 'Suma Total'],
      ...reports.employeeSales.map((r: any) => [r.nombre, r.puesto, r.total_ventas, r.suma_total])
    ];
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "reporte_rendimiento.csv");
    link.click();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans">
      <header className="flex justify-between items-center mb-10 bg-indigo-900 p-6 rounded-xl shadow-lg text-white">
        <h1 className="text-3xl font-black tracking-tight">LUXOR DB | PROYECTO 2</h1>
        <div className="flex gap-4">
          <button onClick={() => window.location.href='/login'} className="bg-red-500 px-4 py-2 rounded font-bold hover:bg-red-600">Cerrar Sesión</button>
        </div>
      </header>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 shadow-sm" role="alert">
          <p className="font-bold">Error del Sistema</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* CRUD PRODUCTOS */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">📦 Gestión de Productos</h2>
          <form onSubmit={handleCreateProduct} className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <input type="text" placeholder="Nombre" className="p-2 border rounded" value={newProduct.nombre} onChange={e => setNewProduct({...newProduct, nombre: e.target.value})} required />
            <input type="text" placeholder="Categoría" className="p-2 border rounded" value={newProduct.categoria} onChange={e => setNewProduct({...newProduct, categoria: e.target.value})} required />
            <input type="number" placeholder="Precio" className="p-2 border rounded" value={newProduct.precio} onChange={e => setNewProduct({...newProduct, precio: Number(e.target.value)})} required />
            <input type="number" placeholder="Stock" className="p-2 border rounded" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} required />
            <select className="p-2 border rounded col-span-2" value={newProduct.id_proveedor} onChange={e => setNewProduct({...newProduct, id_proveedor: Number(e.target.value)})}>
              {providers.map((pr: any) => <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre}</option>)}
            </select>
            <button type="submit" className="col-span-2 bg-indigo-600 text-white p-2 rounded font-bold hover:bg-indigo-700 transition">Agregar Producto</button>
          </form>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Precio</th>
                  <th className="p-2 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p.id_producto} className="border-b hover:bg-gray-50">
                    <td className="p-2">{p.id_producto}</td>
                    <td className="p-2 font-medium">{p.nombre}</td>
                    <td className="p-2 text-indigo-700 font-bold">${p.precio}</td>
                    <td className="p-2 text-center">
                      <button onClick={() => handleDelete('products', p.id_producto)} className="text-red-500 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CRUD CLIENTES */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">👥 Gestión de Clientes</h2>
          <form onSubmit={handleCreateClient} className="grid grid-cols-1 gap-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <input type="text" placeholder="Nombre Completo" className="p-2 border rounded" value={newClient.nombre} onChange={e => setNewClient({...newClient, nombre: e.target.value})} required />
            <input type="email" placeholder="Correo Electrónico" className="p-2 border rounded" value={newClient.correo} onChange={e => setNewClient({...newClient, correo: e.target.value})} required />
            <input type="text" placeholder="Teléfono" className="p-2 border rounded" value={newClient.telefono} onChange={e => setNewClient({...newClient, telefono: e.target.value})} required />
            <button type="submit" className="bg-teal-600 text-white p-2 rounded font-bold hover:bg-teal-700 transition">Registrar Cliente</button>
          </form>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Correo</th>
                  <th className="p-2 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c: any) => (
                  <tr key={c.id_cliente} className="border-b hover:bg-gray-50">
                    <td className="p-2">{c.id_cliente}</td>
                    <td className="p-2 font-medium">{c.nombre}</td>
                    <td className="p-2 text-gray-600">{c.correo}</td>
                    <td className="p-2 text-center">
                      <button onClick={() => handleDelete('clients', c.id_cliente)} className="text-red-500 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* REPORTES */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">📊 Reportes y Analítica SQL</h2>
          <button onClick={handleExportCSV} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 shadow-md transition">
            Exportar CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <h3 className="text-sm font-bold text-blue-800 mb-3 uppercase tracking-wider">Top Categorías (HAVING)</h3>
            <ul className="text-xs space-y-2">
              {reports.topCategories.map((c: any, i) => (
                <li key={i} className="flex justify-between font-medium">
                  <span>{c.categoria}</span>
                  <span className="text-blue-600">${Number(c.precio_promedio).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <h3 className="text-sm font-bold text-emerald-800 mb-3 uppercase tracking-wider">Ventas por Empleado (CTE)</h3>
            <ul className="text-xs space-y-2">
              {reports.employeeSales.map((e: any, i) => (
                <li key={i} className="flex justify-between font-medium">
                  <span>{e.nombre}</span>
                  <span className="text-emerald-600 font-bold">${e.suma_total}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
            <h3 className="text-sm font-bold text-purple-800 mb-3 uppercase tracking-wider">Activos (EXISTS)</h3>
            <div className="flex flex-wrap gap-1">
              {reports.activeClients.map((c: any, i) => (
                <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold">{c.nombre}</span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
            <h3 className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wider">En Venta (IN)</h3>
            <div className="flex flex-wrap gap-1">
              {reports.soldProducts.map((p: any, i) => (
                <span key={i} className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">{p.nombre}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;