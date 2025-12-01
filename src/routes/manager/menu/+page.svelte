<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	// Mock data for menu items
	let products = [
		{
			id: 1,
			name: 'Chaufa de Pollo',
			description: 'Arroz chaufa con trozos de pollo y verduras.',
			price: 18.0,
			category: 'Platos Principales',
			stock: 50,
			active: true,
			image: '/chaufa_de_pollo.png'
		},
		{
			id: 2,
			name: 'Sopa Wantan',
			description: 'Sopa tradicional con wantan relleno de cerdo.',
			price: 12.0,
			category: 'Sopas',
			stock: 20,
			active: true,
			image: '/sopa_wantan.png'
		},
		{
			id: 3,
			name: 'Chi Jau Kay',
			description: 'Pollo rebozado con salsa de ostión y sésamo.',
			price: 24.0,
			category: 'Platos Principales',
			stock: 0,
			active: false,
			image: '/chijaukay.png'
		},
		{
			id: 4,
			name: 'Inka Kola 1.5L',
			description: 'Bebida gaseosa sabor nacional.',
			price: 8.0,
			category: 'Bebidas',
			stock: 100,
			active: true,
			image: '/inkacola.png'
		},
		{
			id: 5,
			name: 'Wantan Frito',
			description: '6 unidades de wantan frito con salsa de tamarindo.',
			price: 10.0,
			category: 'Entradas',
			stock: 35,
			active: true,
			image: '/wantan_frito.png'
		}
	];

	let isModalOpen = false;
	let editingProduct: any = null;

	// Form fields
	let formName = '';
	let formDescription = '';
	let formPrice = 0;
	let formCategory = 'Platos Principales';
	let formStock = 0;
	let formActive = true;

	const categories = ['Platos Principales', 'Sopas', 'Entradas', 'Bebidas', 'Postres'];

	function openAddModal() {
		editingProduct = null;
		resetForm();
		isModalOpen = true;
	}

	function openEditModal(product: any) {
		editingProduct = product;
		formName = product.name;
		formDescription = product.description;
		formPrice = product.price;
		formCategory = product.category;
		formStock = product.stock;
		formActive = product.active;
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		resetForm();
	}

	function resetForm() {
		formName = '';
		formDescription = '';
		formPrice = 0;
		formCategory = 'Platos Principales';
		formStock = 0;
		formActive = true;
	}

	function saveProduct() {
		if (editingProduct) {
			// Update existing
			products = products.map((p) =>
				p.id === editingProduct.id
					? {
							...p,
							name: formName,
							description: formDescription,
							price: formPrice,
							category: formCategory,
							stock: formStock,
							active: formActive
						}
					: p
			);
		} else {
			// Add new
			const newProduct = {
				id: Math.max(...products.map((p) => p.id)) + 1,
				name: formName,
				description: formDescription,
				price: formPrice,
				category: formCategory,
				stock: formStock,
				active: formActive,
				image:
					'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80' // Placeholder
			};
			products = [...products, newProduct];
		}
		closeModal();
	}

	function toggleAvailability(product: any) {
		products = products.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p));
	}

	function formatCurrency(amount: number) {
		return `S/ ${amount.toFixed(2)}`;
	}

	function getStockStatus(stock: number) {
		if (stock === 0) return { label: 'Agotado', color: 'bg-red-100 text-red-800' };
		if (stock < 10) return { label: 'Bajo Stock', color: 'bg-yellow-100 text-yellow-800' };
		return { label: 'En Stock', color: 'bg-green-100 text-green-800' };
	}
</script>

<div class="space-y-6 p-6">
	<header class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-2xl font-bold text-gray-800">Gestión del Menú</h1>
			<p class="text-gray-500">Administra los productos, precios y disponibilidad.</p>
		</div>
		<button
			on:click={openAddModal}
			class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Agregar Producto
		</button>
	</header>

	<!-- Products List -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left">
				<thead>
					<tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
						<th class="px-6 py-4 font-medium">Producto</th>
						<th class="px-6 py-4 font-medium">Categoría</th>
						<th class="px-6 py-4 font-medium">Precio</th>
						<th class="px-6 py-4 font-medium">Stock</th>
						<th class="px-6 py-4 font-medium">Estado</th>
						<th class="px-6 py-4 font-medium text-right">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each products as product}
						<tr class="hover:bg-gray-50 transition-colors group">
							<td class="px-6 py-4">
								<div class="flex items-center gap-4">
									<img
										src={product.image}
										alt={product.name}
										class="w-12 h-12 rounded-lg object-cover bg-gray-100"
									/>
									<div>
										<p class="font-medium text-gray-900">{product.name}</p>
										<p class="text-xs text-gray-500 max-w-[200px] truncate">
											{product.description}
										</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 text-gray-600 text-sm">{product.category}</td>
							<td class="px-6 py-4 font-medium text-gray-900">{formatCurrency(product.price)}</td>
							<td class="px-6 py-4">
								<div class="flex items-center gap-2">
									<span class="text-sm text-gray-700">{product.stock} un.</span>
									{#if product.stock < 10 && product.stock > 0}
										<span
											class="w-2 h-2 rounded-full bg-yellow-400"
											title="Stock bajo"
											aria-label="Stock bajo"
										></span>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4">
								<button
									on:click={() => toggleAvailability(product)}
									class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 {product.active
										? 'bg-green-500'
										: 'bg-gray-200'}"
									role="switch"
									aria-checked={product.active}
									aria-label={product.active ? 'Desactivar producto' : 'Activar producto'}
								>
									<span
										class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {product.active
											? 'translate-x-6'
											: 'translate-x-1'}"
									></span>
								</button>
							</td>
							<td class="px-6 py-4 text-right">
								<button
									on:click={() => openEditModal(product)}
									class="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50"
									aria-label="Editar producto"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Add/Edit Modal -->
	{#if isModalOpen}
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				class="absolute inset-0 bg-black/50 backdrop-blur-sm"
				transition:fade={{ duration: 200 }}
				on:click={closeModal}
				role="button"
				tabindex="0"
				on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && closeModal()}
				aria-label="Cerrar modal"
			></div>
			<div
				class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
				transition:fly={{ y: 20, duration: 300 }}
			>
				<div
					class="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center"
				>
					<h2 class="text-xl font-bold text-gray-800">
						{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
					</h2>
					<button
						on:click={closeModal}
						class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
						aria-label="Cerrar modal"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div class="p-6 space-y-4">
					<div>
						<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
						<input
							type="text"
							id="name"
							bind:value={formName}
							class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="Ej: Arroz Chaufa"
						/>
					</div>

					<div>
						<label for="description" class="block text-sm font-medium text-gray-700 mb-1"
							>Descripción</label
						>
						<textarea
							id="description"
							bind:value={formDescription}
							rows="2"
							class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="Breve descripción del plato..."
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="price" class="block text-sm font-medium text-gray-700 mb-1"
								>Precio (S/)</label
							>
							<input
								type="number"
								id="price"
								bind:value={formPrice}
								step="0.50"
								min="0"
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>
						<div>
							<label for="stock" class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
							<input
								type="number"
								id="stock"
								bind:value={formStock}
								min="0"
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>
					</div>

					<div>
						<label for="category" class="block text-sm font-medium text-gray-700 mb-1"
							>Categoría</label
						>
						<select
							id="category"
							bind:value={formCategory}
							class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						>
							{#each categories as category}
								<option value={category}>{category}</option>
							{/each}
						</select>
					</div>

					<div class="flex items-center gap-2 pt-2">
						<input
							type="checkbox"
							id="active"
							bind:checked={formActive}
							class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label for="active" class="text-sm font-medium text-gray-700"
							>Producto disponible para la venta</label
						>
					</div>
				</div>

				<div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
					<button
						on:click={closeModal}
						class="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
					>
						Cancelar
					</button>
					<button
						on:click={saveProduct}
						class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
					>
						Guardar
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
