import { useEffect, useState } from 'react'
import './App.css'
import { apiDownload, apiRequest } from './api'
import skincareProductImage from './assets/products/skincare.jpg'
import pharmacyPillsImage from './assets/products/pharma-pills.jpg'
import pharmacyLabImage from './assets/products/pharma-lab.jpg'
import pharmacyCapsuleImage from './assets/products/pharma-capsule.jpg'
import pharmacyBottleImage from './assets/products/pharma-bottle.jpg'
import pharmacyVialsImage from './assets/products/pharma-vials.jpg'
import pharmacyMoleculeImage from './assets/products/pharma-molecule.jpg'
import pharmacyAssortedImage from './assets/products/pharma-assorted.jpg'
import pharmacyOrangePillImage from './assets/products/pharma-orange-pill.jpg'
import hairCareImage from './assets/products/hair-care.jpg'
import oralCareImage from './assets/products/oral-care.jpg'
import medicalDeviceImage from './assets/products/medical-device.jpg'
import medicineTabletsImage from './assets/products/medicine-tablets.jpg'
import vitaminsCategoryImage from './assets/products/vitamins-category.jpg'
import herbalProductsImage from './assets/products/herbal-products.jpg'
import babyCareImage from './assets/products/baby-care.jpg'
import selfCareImage from './assets/products/self-care.jpg'

const pharmacyImages = [
  pharmacyPillsImage,
  pharmacyLabImage,
  pharmacyCapsuleImage,
  pharmacyBottleImage,
  pharmacyVialsImage,
  pharmacyMoleculeImage,
  pharmacyAssortedImage,
  pharmacyOrangePillImage,
]
const medicineProductImages = [
  medicineTabletsImage,
  pharmacyPillsImage,
  pharmacyCapsuleImage,
  pharmacyBottleImage,
  pharmacyAssortedImage,
  pharmacyOrangePillImage,
]
const wellnessProductImages = [
  vitaminsCategoryImage,
  pharmacyVialsImage,
  pharmacyMoleculeImage,
  pharmacyLabImage,
]
const OTP_RESEND_DELAY_SECONDS = 60

const marketplacePromos = [
  {
    eyebrow: 'EVERYDAY WELLNESS',
    title: 'Care essentials for every day',
    offer: 'Explore trusted medicines',
    category: 'Medicines',
    image: pharmacyImages[0],
    tone: 'coral',
  },
  {
    eyebrow: 'VITAMINS & NUTRITION',
    title: 'Make wellness part of your routine',
    offer: 'Shop vitamins and supplements',
    category: 'Vitamins',
    image: pharmacyImages[1],
    tone: 'gold',
  },
  {
    eyebrow: 'PERSONAL CARE',
    title: 'A little care goes a long way',
    offer: 'Explore personal care',
    category: 'Personal care',
    image: pharmacyImages[2],
    tone: 'plum',
  },
  {
    eyebrow: 'HEALTH AT HOME',
    title: 'Feel ready for the little things',
    offer: 'Browse health devices',
    category: 'Devices',
    image: pharmacyImages[3],
    tone: 'forest',
  },
  {
    eyebrow: 'FAMILY WELLNESS',
    title: 'Thoughtful picks for your family',
    offer: 'Shop family essentials',
    category: 'Baby products',
    image: pharmacyImages[4],
    tone: 'blue',
  },
]

const marketplaceDealGroups = [
  {
    title: 'Everyday pharmacy essentials',
    items: [
      { label: 'Medicines', image: pharmacyImages[0], category: 'Medicines' },
      { label: 'Vitamins & supplements', image: pharmacyImages[1], category: 'Vitamins' },
      { label: 'Health devices', image: pharmacyImages[2], category: 'Devices' },
      { label: 'Browse all medicines', image: pharmacyImages[3], category: 'Medicines' },
    ],
  },
  {
    title: 'Personal care picks',
    items: [
      { label: 'Skin care', image: pharmacyImages[4], category: 'Personal care' },
      { label: 'Hair care', image: pharmacyImages[5], category: 'Hair care' },
      { label: 'Daily wellness', image: pharmacyImages[6], category: 'Wellness' },
      { label: 'Oral care', image: pharmacyImages[7], category: 'Oral care' },
    ],
  },
  {
    title: 'Wellness for the whole family',
    items: [
      { label: 'Vitamins', image: pharmacyImages[1], category: 'Vitamins' },
      { label: 'Baby products', image: pharmacyImages[2], category: 'Baby products' },
      { label: 'Ayurveda', image: pharmacyImages[3], category: 'Ayurveda' },
      { label: 'Health products', image: pharmacyImages[4], category: 'Wellness' },
    ],
  },
  {
    title: 'Explore health at home',
    items: [
      { label: 'Health tools', image: pharmacyImages[5], category: 'Devices' },
      { label: 'Everyday care', image: pharmacyImages[6], category: 'Personal care' },
      { label: 'Family essentials', image: pharmacyImages[7], category: 'Baby products' },
      { label: 'Shop all products', image: pharmacyImages[0], category: 'All products' },
    ],
  },
  {
    title: 'Daily care, made simple',
    items: [
      { label: 'Skin care', image: pharmacyImages[2], category: 'Personal care' },
      { label: 'Nutrition', image: pharmacyImages[3], category: 'Vitamins' },
      { label: 'Medicine cabinet', image: pharmacyImages[4], category: 'Medicines' },
      { label: 'Oral health', image: pharmacyImages[5], category: 'Oral care' },
    ],
  },
  {
    title: 'Feel-good wellness finds',
    items: [
      { label: 'Herbal care', image: pharmacyImages[6], category: 'Ayurveda' },
      { label: 'Daily vitamins', image: pharmacyImages[7], category: 'Vitamins' },
      { label: 'Personal care', image: pharmacyImages[0], category: 'Personal care' },
      { label: 'Health essentials', image: pharmacyImages[1], category: 'Medicines' },
    ],
  },
  {
    title: 'Health essentials for home',
    items: [
      { label: 'Home health tools', image: pharmacyImages[3], category: 'Devices' },
      { label: 'Wellness', image: pharmacyImages[4], category: 'Wellness' },
      { label: 'Skin & body', image: pharmacyImages[5], category: 'Personal care' },
      { label: 'Shop vitamins', image: pharmacyImages[6], category: 'Vitamins' },
    ],
  },
  {
    title: 'Care for every age',
    items: [
      { label: 'Family health', image: pharmacyImages[7], category: 'Medicines' },
      { label: 'Baby care', image: pharmacyImages[0], category: 'Baby products' },
      { label: 'Nutrition', image: pharmacyImages[1], category: 'Vitamins' },
      { label: 'Everyday essentials', image: pharmacyImages[2], category: 'Personal care' },
    ],
  },
]

function getProductImage(category = '', productKey = '') {
  const normalizedCategory = category.toLowerCase()
  let images = medicineProductImages

  if (/hair/.test(normalizedCategory)) {
    images = [hairCareImage]
  } else if (/oral/.test(normalizedCategory)) {
    images = [oralCareImage]
  } else if (/baby|infant/.test(normalizedCategory)) {
    images = [babyCareImage]
  } else if (/device|tool|equipment/.test(normalizedCategory)) {
    images = [medicalDeviceImage]
  } else if (/herbal|ayurveda/.test(normalizedCategory)) {
    images = [herbalProductsImage]
  } else if (/vitamin|supplement|wellness/.test(normalizedCategory)) {
    images = wellnessProductImages
  } else if (/personal|skin|beauty|self.?care/.test(normalizedCategory)) {
    images = [selfCareImage, skincareProductImage]
  }

  const imageIndex = Array.from(`${normalizedCategory}:${productKey}`).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    0
  ) % images.len
  return images[imageIndex]
}

function mapProduct(product) {
  return {
    id: product._id,
    name: product.name,
    detail: product.description,
    category: product.category,
    brand: product.brand,
    price: product.price,
    oldPrice: product.oldPrice,
    badge: product.requiresPrescription ? 'Prescription required' : 'Available',
    requiresPrescription: product.requiresPrescription,
    stock: product.stock,
    image: getProductImage(product.category, product._id || product.name),
  }
}

function mapCart(cartData) {
  return (cartData?.items || [])
    .filter((item) => item.productId)
    .map((item) => ({
      ...mapProduct(item.productId),
      quantity: item.quantity,
    }))
}

function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount || 0)
}

const categories = ['All products', 'Medicines', 'Vitamins', 'Wellness', 'Personal care', 'Baby products', 'Ayurveda', 'Devices', 'Oral care', 'Hair care']
const categoryLabels = { Wellness: 'Health products', Ayurveda: 'Herbal products', Devices: 'Health tools' }
const pageParams = new URLSearchParams(window.location.search)
const requestedCategory = pageParams.get('category')
const isCartPage = pageParams.get('view') === 'cart'
const isWishlistPage = pageParams.get('view') === 'wishlist'
const isOrdersPage = pageParams.get('view') === 'orders'
const isBrandsPage = pageParams.get('view') === 'brands'
const initialBrand = pageParams.get('brand') || ''
const initialCategory = categories.includes(requestedCategory) ? requestedCategory : 'All products'
function getCategoryHref(category) {
  return category === 'All products' ? '/' : `/?category=${encodeURIComponent(category)}`
}

const conditions = [
  { name: 'Diabetes', icon: '◉', color: 'mint' },
  { name: 'Heart health', icon: '♡', color: 'lavender' },
  { name: 'Stomach health', icon: '◒', color: 'peach' },
  { name: 'Pain relief', icon: '✳', color: 'blue' },
  { name: 'Liver health', icon: '◇', color: 'rose' },
]

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 8v10m-5-5h10" stroke="white" strokeWidth="3.2" strokeLinecap="round" /><path d="M10 23.5c2.5 5.7 6.5 8.5 12 8.5s9.5-2.8 12-8.5M14 30c2.2 2.6 4.9 4 8 4s5.8-1.4 8-4" stroke="#C8E9DF" strokeWidth="2.2" strokeLinecap="round" /></svg></span>
}

function CartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.9-1.5L20 8H6" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /></svg>
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
}

function UploadIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M12 15V4m-4 4 4-4 4 4" /><path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" /></svg>
}

function ThermometerIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z" /><path d="M11 11v7" /></svg>
}

function App() {
  const [search, setSearch] = useState('')
  const activeCategory = initialCategory
  const [activeBrand, setActiveBrand] = useState(initialBrand)
  const [medicines, setMedicines] = useState([])
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const savedIds = JSON.parse(window.localStorage.getItem('medinest-wishlist') || '[]')
      return Array.isArray(savedIds) ? savedIds : []
    } catch {
      return []
    }
  })
  const [brands, setBrands] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState('')
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [userName, setUserName] = useState('')
  const [profileName, setProfileName] = useState('')
  const [profileFeedback, setProfileFeedback] = useState('')
  const [userRole, setUserRole] = useState('user')
  const [token, setToken] = useState(() => window.localStorage.getItem('medinest-token') || '')
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [checkoutKey, setCheckoutKey] = useState('')
  const [inventory, setInventory] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [adminFeedback, setAdminFeedback] = useState('')
  const [prescriptionProducts, setPrescriptionProducts] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [adminPrescriptions, setAdminPrescriptions] = useState([])
  const [prescriptionProductId, setPrescriptionProductId] = useState('')
  const [prescriptionFeedback, setPrescriptionFeedback] = useState('')
  const [apiError, setApiError] = useState('')
  const [authFeedback, setAuthFeedback] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [resetOtp, setResetOtp] = useState('')
  const [otpResendCountdown, setOtpResendCountdown] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reminderMedicineId, setReminderMedicineId] = useState('')
  const [reminderDays, setReminderDays] = useState(7)
  const [reminders, setReminders] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem('medinest-refill-reminders') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem('medinest-refill-reminders', JSON.stringify(reminders))
  }, [reminders])

  useEffect(() => {
    window.localStorage.setItem('medinest-wishlist', JSON.stringify(wishlistIds))
  }, [wishlistIds])

  useEffect(() => {
    if (otpResendCountdown <= 0) return undefined

    const timer = window.setTimeout(() => {
      setOtpResendCountdown((current) => Math.max(0, current - 1))
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [otpResendCountdown])

  useEffect(() => {
    let active = true
    const timer = window.setTimeout(async () => {
      setCatalogLoading(true)
      setApiError('')
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (activeCategory !== 'All products') params.set('category', activeCategory)
      if (activeBrand) params.set('brand', activeBrand)
      try {
        const query = params.toString()
        const result = await apiRequest(`/products${query ? `?${query}` : ''}`)
        if (active) {
          const products = result.products || []
          setMedicines(products.map(mapProduct))
          if (!search.trim() && activeCategory === 'All products' && !activeBrand) {
            setBrands([...new Set(products.map((product) => product.brand).filter(Boolean))])
          }
        }
      } catch (error) {
        if (active) {
          setMedicines([])
          setApiError(error.message)
        }
      } finally {
        if (active) setCatalogLoading(false)
      }
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [search, activeCategory, activeBrand])

  useEffect(() => {
    let active = true
    apiRequest('/products?requiresPrescription=true')
      .then((result) => {
        if (active) setPrescriptionProducts(result.products || [])
      })
      .catch((error) => {
        if (active) setApiError(error.message)
      })

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!token) {
      window.localStorage.removeItem('medinest-token')
      return
    }

    window.localStorage.setItem('medinest-token', token)
    let active = true
    Promise.all([
      apiRequest('/users/me', { token }),
      apiRequest('/cart', { token }),
      apiRequest('/users/me/addresses', { token }),
      apiRequest('/prescriptions/mine', { token }),
    ]).then(async ([profile, cartResult, addressResult, prescriptionResult]) => {
      if (!active) return
      const user = profile.user?.userData || profile.user
      const role = user?.role || 'user'
      setUserName(user?.name?.split(' ')[0] || 'Member')
      setProfileName(user?.name || '')
      setUserRole(role)
      setCart(mapCart(cartResult.cart))
      setPrescriptions(prescriptionResult.prescriptions || [])
      const orderResult = await apiRequest(
        role === 'admin' ? '/orders/admin' : '/orders/my-orders',
        { token }
      )
      setOrders(orderResult.orders || [])
      if (role === 'admin') {
        const [inventoryResult, usersResult, prescriptionsResult] = await Promise.all([
          apiRequest('/products/admin/inventory', { token }),
          apiRequest('/users', { token }),
          apiRequest('/prescriptions/admin', { token }),
        ])
        setInventory(inventoryResult.products || [])
        setAdminUsers(usersResult.users || [])
        setAdminPrescriptions(prescriptionsResult.prescriptions || [])
      } else {
        setInventory([])
        setAdminUsers([])
        setAdminPrescriptions([])
      }
      const savedAddresses = addressResult.addresses || []
      setAddresses(savedAddresses)
      setSelectedAddressId(savedAddresses.find((address) => address.isDefault)?._id || '')
    }).catch((error) => {
      if (!active) return
      setApiError(error.message)
      if (error.status === 401) {
        window.localStorage.removeItem('medinest-token')
        setToken('')
        setCart([])
        setOrders([])
        setAddresses([])
        setSelectedAddressId('')
        setPrescriptions([])
        setAdminPrescriptions([])
        setInventory([])
        setAdminUsers([])
        setUserName('')
        setProfileName('')
        setUserRole('user')
      }
    })

    return () => { active = false }
  }, [token])

  const filteredMedicines = isWishlistPage
    ? medicines.filter((medicine) => wishlistIds.includes(medicine.id))
    : medicines
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const isCatalogPage = initialCategory !== 'All products' || isCartPage || isWishlistPage || isOrdersPage || isBrandsPage || Boolean(initialBrand)

  function toggleWishlist(productId) {
    setWishlistIds((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId])
  }

  async function refreshCart() {
    if (!token) return
    const result = await apiRequest('/cart', { token })
    setCart(mapCart(result.cart))
  }

  async function addToCart(medicine) {
    if (!token) {
      setAuthMode('login')
      setIsAuthOpen(true)
      setAuthFeedback('Sign in to add products to your cart.')
      return
    }

    setOrderPlaced(false)
    setIsCheckoutOpen(false)
    setApiError('')
    try {
      await apiRequest('/cart/add', {
        method: 'POST',
        token,
        body: { productId: medicine.id, quantity: 1 },
      })
      await refreshCart()
    } catch (error) {
      setApiError(error.message)
    }
  }

  async function changeQuantity(medicineId, amount) {
    const item = cart.find((cartItem) => cartItem.id === medicineId)
    if (!item || !token) return
    const quantity = item.quantity + amount
    try {
      if (quantity < 1) {
        await apiRequest(`/cart/remove/${medicineId}`, { method: 'DELETE', token })
      } else {
        await apiRequest(`/cart/update/${medicineId}`, {
          method: 'PUT',
          token,
          body: { quantity },
        })
      }
      await refreshCart()
    } catch (error) {
      setApiError(error.message)
    }
  }

  function addRefillReminder(event) {
    event.preventDefault()
    const medicine = medicines.find((item) => item.id === reminderMedicineId)
    if (!medicine) return

    const dueDate = new Date(Date.now() + Number(reminderDays) * 24 * 60 * 60 * 1000)
    setReminders((current) => [
      ...current,
      {
        id: `${medicine.id}-${Date.now()}`,
        medicineId: medicine.id,
        name: medicine.name,
        dueDate: dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      },
    ])
  }

  async function reorder(items) {
    if (!token) {
      setAuthMode('login')
      setIsAuthOpen(true)
      setAuthFeedback('Sign in to reorder products.')
      return
    }

    try {
      for (const item of items) {
        await apiRequest('/cart/add', {
          method: 'POST',
          token,
          body: { productId: item.productId, quantity: item.quantity },
        })
      }
      await refreshCart()
      setOrderPlaced(false)
      window.location.assign('/?view=cart')
    } catch (error) {
      setApiError(error.message)
    }
  }

  async function refreshOrders() {
    if (!token) return
    const result = await apiRequest(
      userRole === 'admin' ? '/orders/admin' : '/orders/my-orders',
      { token }
    )
    setOrders(result.orders || [])
  }

  async function saveProfile(event) {
    event.preventDefault()
    setProfileFeedback('')
    try {
      const result = await apiRequest('/users/me', {
        method: 'PATCH',
        token,
        body: { name: profileName },
      })
      setProfileName(result.user.name)
      setUserName(result.user.name.split(' ')[0])
      setProfileFeedback('Profile updated.')
    } catch (error) {
      setProfileFeedback(error.message)
    }
  }

  async function updateSavedAddress(event, addressId) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const body = Object.fromEntries(
      ['label', 'fullName', 'phone', 'streetAddress', 'locality', 'city', 'state', 'postalCode', 'country']
        .map((field) => [field, formData.get(field)])
    )
    try {
      const result = await apiRequest(`/users/me/addresses/${addressId}`, {
        method: 'PUT',
        token,
        body,
      })
      setAddresses(result.addresses || [])
      setProfileFeedback('Address updated.')
    } catch (error) {
      setProfileFeedback(error.message)
    }
  }

  async function setDefaultAddress(addressId) {
    try {
      const result = await apiRequest(`/users/me/addresses/${addressId}`, {
        method: 'PUT',
        token,
        body: { isDefault: true },
      })
      setAddresses(result.addresses || [])
      setSelectedAddressId(addressId)
      setProfileFeedback('Default address updated.')
    } catch (error) {
      setProfileFeedback(error.message)
    }
  }

  async function deleteSavedAddress(addressId) {
    try {
      const result = await apiRequest(`/users/me/addresses/${addressId}`, {
        method: 'DELETE',
        token,
      })
      const savedAddresses = result.addresses || []
      setAddresses(savedAddresses)
      setSelectedAddressId(savedAddresses.find((address) => address.isDefault)?._id || '')
      setProfileFeedback('Address deleted.')
    } catch (error) {
      setProfileFeedback(error.message)
    }
  }

  async function cancelOrder(orderId) {
    try {
      await apiRequest(`/orders/${orderId}/cancel`, { method: 'POST', token })
      await refreshOrders()
    } catch (error) {
      setApiError(error.message)
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      await apiRequest(`/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        token,
        body: { status },
      })
      await refreshOrders()
    } catch (error) {
      setApiError(error.message)
    }
  }

  async function refreshAdminData() {
    const [inventoryResult, usersResult, orderResult, catalogResult, prescriptionsResult] = await Promise.all([
      apiRequest('/products/admin/inventory', { token }),
      apiRequest('/users', { token }),
      apiRequest('/orders/admin', { token }),
      apiRequest('/products'),
      apiRequest('/prescriptions/admin', { token }),
    ])
    setInventory(inventoryResult.products || [])
    setAdminUsers(usersResult.users || [])
    setOrders(orderResult.orders || [])
    setMedicines((catalogResult.products || []).map(mapProduct))
    setAdminPrescriptions(prescriptionsResult.prescriptions || [])
  }

  async function refreshPrescriptions() {
    const result = await apiRequest('/prescriptions/mine', { token })
    setPrescriptions(result.prescriptions || [])
  }

  async function uploadPrescription(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const file = formData.get('prescriptionFile')
    const productId = formData.get('productId')
    if (!(file instanceof File) || !file.size || !productId) {
      setPrescriptionFeedback('Choose a product and prescription file.')
      return
    }

    setIsSubmitting(true)
    setPrescriptionFeedback('')
    try {
      await apiRequest(`/prescriptions/${productId}`, {
        method: 'POST',
        token,
        headers: { 'Content-Type': 'application/octet-stream' },
        body: file,
      })
      form.reset()
      setPrescriptionProductId('')
      await refreshPrescriptions()
      setPrescriptionFeedback('Prescription uploaded securely and submitted for review.')
    } catch (error) {
      setPrescriptionFeedback(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function downloadPrescription(prescriptionId, forReview = false) {
    try {
      const path = forReview
        ? `/prescriptions/admin/${prescriptionId}/file`
        : `/prescriptions/mine/${prescriptionId}/file`
      const file = await apiDownload(path, token)
      const extension = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/png' ? 'png' : 'jpg'
      const url = window.URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = `prescription-${prescriptionId}.${extension}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    } catch (error) {
      if (forReview) setAdminFeedback(error.message)
      else setPrescriptionFeedback(error.message)
    }
  }

  async function reviewPrescription(prescriptionId, status) {
    try {
      await apiRequest(`/prescriptions/admin/${prescriptionId}`, {
        method: 'PATCH',
        token,
        body: { status },
      })
      await refreshAdminData()
      setAdminFeedback(`Prescription ${status.toLowerCase()}.`)
    } catch (error) {
      setAdminFeedback(error.message)
    }
  }

  async function addProduct(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setAdminFeedback('')
    try {
      await apiRequest('/products', {
        method: 'POST',
        token,
        body: {
          name: formData.get('name'),
          description: formData.get('description'),
          brand: formData.get('brand'),
          category: formData.get('category'),
          price: Number(formData.get('price')),
          oldPrice: Number(formData.get('oldPrice') || 0),
          stock: Number(formData.get('stock')),
          requiresPrescription: formData.get('requiresPrescription') === 'on',
        },
      })
      form.reset()
      await refreshAdminData()
      setAdminFeedback('Product added.')
    } catch (error) {
      setAdminFeedback(error.message)
    }
  }

  async function updateProduct(product) {
    try {
      await apiRequest(`/products/${product._id}`, {
        method: 'PATCH',
        token,
        body: { price: Number(product.price), stock: Number(product.stock) },
      })
      await refreshAdminData()
      setAdminFeedback('Product updated.')
    } catch (error) {
      setAdminFeedback(error.message)
    }
  }

  async function deactivateProduct(productId) {
    try {
      await apiRequest(`/products/${productId}`, { method: 'DELETE', token })
      await refreshAdminData()
      setAdminFeedback('Product deactivated.')
    } catch (error) {
      setAdminFeedback(error.message)
    }
  }

  async function activateProduct(productId) {
    try {
      await apiRequest(`/products/${productId}`, {
        method: 'PATCH',
        token,
        body: { isActive: true },
      })
      await refreshAdminData()
      setAdminFeedback('Product activated.')
    } catch (error) {
      setAdminFeedback(error.message)
    }
  }

  function updateInventoryField(productId, field, value) {
    setInventory((current) => current.map((product) => (
      product._id === productId ? { ...product, [field]: value } : product
    )))
  }

  async function handleAuthSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = (formData.get('email') || resetEmail).toString().trim()
    setIsSubmitting(true)
    setAuthFeedback('')
    setApiError('')

    try {
      if (authMode === 'register') {
        await apiRequest('/users/signup', {
          method: 'POST',
          body: {
            name: formData.get('fullName'),
            email,
            password: formData.get('password'),
          },
        })
        setResetEmail(email)
        setAuthMode('login')
        setAuthFeedback('Account created. Sign in with your new credentials.')
      } else if (authMode === 'login') {
        const result = await apiRequest('/users/login', {
          method: 'POST',
          body: { email, password: formData.get('password') },
        })
        setToken(result.data.token)
        setUserName(result.data.user.name.split(' ')[0])
        setUserRole(result.data.user.role || 'user')
        setIsAuthOpen(false)
        setAuthFeedback('')
      } else if (authMode === 'forgot') {
        await apiRequest('/users/forgot-password', {
          method: 'POST',
          body: { email },
        })
        setResetEmail(email)
        setResetOtp('')
        setOtpResendCountdown(OTP_RESEND_DELAY_SECONDS)
        setAuthMode('verify')
        setAuthFeedback('If an account exists for this email, a reset code will be sent.')
      } else if (authMode === 'verify') {
        const otp = formData.get('otp').toString().trim()
        await apiRequest('/users/verify-otp', {
          method: 'POST',
          body: { email, otp },
        })
        setResetOtp(otp)
        setAuthMode('reset')
        setAuthFeedback('Code verified. Choose a new password.')
      } else {
        await apiRequest('/users/reset-password', {
          method: 'POST',
          body: {
            email,
            otp: formData.get('otp') || resetOtp,
            newPassword: formData.get('newPassword'),
            confirmPassword: formData.get('confirmPassword'),
          },
        })
        setAuthMode('login')
        setAuthFeedback('Password updated. Sign in with your new password.')
      }
    } catch (error) {
      setAuthFeedback(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function resendResetCode() {
    setIsSubmitting(true)
    setAuthFeedback('')
    try {
      await apiRequest('/users/forgot-password', {
        method: 'POST',
        body: { email: resetEmail },
      })
      setResetOtp('')
      setAuthMode('verify')
      setOtpResendCountdown(OTP_RESEND_DELAY_SECONDS)
      setAuthFeedback('If an account exists for this email, a new reset code will be sent.')
    } catch (error) {
      setAuthFeedback(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function signOut() {
    if (token) {
      try {
        await apiRequest('/users/logout', { method: 'POST', token })
      } catch (error) {
        setApiError(error.message)
      }
    }
    setToken('')
    setCart([])
    setOrders([])
    setAddresses([])
    setSelectedAddressId('')
    setPrescriptions([])
    setAdminPrescriptions([])
    setUserName('')
    setProfileName('')
    setUserRole('user')
    setIsAuthOpen(false)
  }

  async function handleCheckoutSubmit(event) {
    event.preventDefault()
    if (!token) {
      setIsAuthOpen(true)
      setAuthMode('login')
      return
    }

    setIsSubmitting(true)
    setApiError('')
    const formData = new FormData(event.currentTarget)
    const address = {
      fullName: formData.get('fullName')?.toString().trim(),
      phone: formData.get('phone')?.toString().trim(),
      streetAddress: formData.get('streetAddress')?.toString().trim(),
      city: formData.get('city')?.toString().trim(),
      state: formData.get('state')?.toString().trim(),
      postalCode: formData.get('postalCode')?.toString().trim(),
      country: 'India',
    }

    try {
      let checkoutAddress = selectedAddressId
        ? { addressId: selectedAddressId }
        : { deliveryAddress: address }
      if (!selectedAddressId && formData.get('saveAddress') === 'on') {
        const saved = await apiRequest('/users/me/addresses', {
          method: 'POST',
          token,
          body: address,
        })
        const savedAddress = saved.addresses?.[saved.addresses.length - 1]
        if (!savedAddress?._id) throw new Error('Address was not saved')
        setAddresses(saved.addresses)
        setSelectedAddressId(savedAddress._id)
        checkoutAddress = { addressId: savedAddress._id }
      }

      const result = await apiRequest('/orders/place', {
        method: 'POST',
        token,
        headers: { 'Idempotency-Key': checkoutKey },
        body: {
          ...checkoutAddress,
          paymentMethod: 'COD',
          idempotencyKey: checkoutKey,
        },
      })
      setPlacedOrderId(String(result.orderId).slice(-8).toUpperCase())
      setOrderPlaced(true)
      setIsCheckoutOpen(false)
      setCheckoutKey('')
      await Promise.all([refreshCart(), refreshOrders()])
    } catch (error) {
      setApiError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function openCheckout() {
    if (!token) {
      setAuthMode('login')
      setIsAuthOpen(true)
      setAuthFeedback('Sign in before checkout.')
      return
    }
    setCheckoutKey((current) => current || window.crypto.randomUUID())
    setIsCheckoutOpen(true)
  }

  return (
    <main id="top" className={[
      isCatalogPage && 'catalog-page',
      isCartPage && 'cart-page',
      isOrdersPage && 'orders-page',
      isBrandsPage && 'brands-page',
    ].filter(Boolean).join(' ')}>
      <header className="store-header">
        <div className="store-header-main">
          <a className="brand" href="/" aria-label="MediNest home">
            <BrandMark />
            <span>Medi<span>Nest</span><small>MEDICINE & HEALTH</small></span>
          </a>
          <div className="market-delivery"><span aria-hidden="true">⌖</span><span><small>Delivering across</small><strong>India</strong></span></div>
          <label className="market-search">
            <span className="market-search-scope">All</span>
            <span className="sr-only">Search medicines and health products</span>
            <input type="search" placeholder="Search medicines and health products" value={search} onChange={(event) => setSearch(event.target.value)} />
            {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
            <span className="market-search-icon" aria-hidden="true"><SearchIcon /></span>
          </label>
          <div className="header-actions">
            <button className="market-account" type="button" onClick={() => {
              if (token) {
                signOut()
              } else {
                setAuthMode('login')
                setAuthFeedback('')
                setIsAuthOpen(true)
              }
            }}>
              <small>{userName ? `Hello, ${userName}` : 'Hello, sign in'}</small>
              <strong>{userName ? 'Sign out' : 'Account'}</strong>
            </button>
            <a className="market-orders" href="/?view=orders"><small>Returns &</small><strong>Orders</strong></a>
            <a className="icon-cart" href="/?view=cart" aria-label={`View cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}>
              <span aria-hidden="true"><CartIcon /></span><strong>Cart</strong>{cartCount > 0 && <b>{cartCount}</b>}
            </a>
          </div>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          <a className={!isCatalogPage ? 'selected' : ''} href="/">Shop all</a>
          <a className={initialCategory === 'Medicines' ? 'selected' : ''} href="/?category=Medicines">Medicines</a>
          <a className={initialCategory === 'Vitamins' ? 'selected' : ''} href="/?category=Vitamins">Vitamins & nutrition</a>
          <a className={initialCategory === 'Personal care' ? 'selected' : ''} href="/?category=Personal%20care">Personal care</a>
          <a className={isWishlistPage ? 'selected' : ''} href="/?view=wishlist">Wishlist{wishlistIds.length > 0 ? ` (${wishlistIds.length})` : ''}</a>
          <a className={isCartPage ? 'selected' : ''} href="/?view=cart">Cart{cartCount > 0 ? ` (${cartCount})` : ''}</a>
          <a className={isBrandsPage ? 'selected' : ''} href="/?view=brands">Brands</a>
          <a className={isOrdersPage ? 'selected' : ''} href="/?view=orders">Your orders</a>
          <a href="#upload-prescription">Upload prescription</a>
          <a href="#conditions">Shop by health issue</a>
          <a href="#refills">Medicine reminders</a>
          {userRole === 'admin' && <a href="#admin">Admin</a>}
        </nav>
      </header>

      <section className="marketplace-promos" aria-label="Featured pharmacy offers">
        <div className="marketplace-promos-heading">
          <div><p className="section-kicker">A HEALTHIER EVERYDAY STARTS HERE</p><h1>Find care for every day.</h1></div>
          <a href="/">Shop all products <span aria-hidden="true">→</span></a>
        </div>
        <div className="promo-strip">
          {marketplacePromos.map((promo) => (
            <article className={`promo-card promo-${promo.tone}`} key={promo.eyebrow}>
              <img src={promo.image} alt="" />
              <div className="promo-copy">
                <small>{promo.eyebrow}</small>
                <h2>{promo.title}</h2>
                <a href={getCategoryHref(promo.category)}>{promo.offer}<span aria-hidden="true"> →</span></a>
              </div>
              <span className="promo-discount">Care you can count on</span>
            </article>
          ))}
        </div>
      </section>

      <section className="service-tiles" id="services" aria-label="Popular services">
        <a className="service-tile rx-tile" href="#medicines">
          <span className="tile-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M12 11v6m-3-3h6" /></svg><b>+</b></span>
          <span><strong>Save on medicines</strong><small>SHOP MEDICINES</small></span><span className="tile-arrow">›</span>
        </a>
        <a className="service-tile upload-tile" href="#upload-prescription">
          <span className="tile-icon" aria-hidden="true"><UploadIcon /></span>
          <span><strong>Prescription upload</strong><small>PDF or clear photo</small></span><span className="tile-arrow">›</span>
        </a>
        <a className="service-tile wellness-tile" href={getCategoryHref('Wellness')}>
          <span className="tile-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" /></svg></span>
          <span><strong>Health products</strong><small>SHOP HEALTH PRODUCTS</small></span><span className="tile-arrow">›</span>
        </a>
        <a className="service-tile device-tile" href={getCategoryHref('Devices')}>
          <span className="tile-icon" aria-hidden="true"><ThermometerIcon /></span>
          <span><strong>Health tools</strong><small>SHOP DEVICES</small></span><span className="tile-arrow">›</span>
        </a>
      </section>

      <section className="deal-grid-section" aria-label="Shop pharmacy categories">
        <div className="deal-grid">
          {marketplaceDealGroups.map((group) => (
            <article className="deal-group" key={group.title}>
              <a className="deal-group-heading" href="/">
                <h2>{group.title}</h2><span aria-hidden="true">›</span>
              </a>
              <div className="deal-group-items">
                {group.items.map((item) => (
                  <a
                    className="deal-item"
                    href={getCategoryHref(item.category)}
                    key={`${group.title}-${item.label}`}
                  >
                    <img src={item.image} alt="" loading="lazy" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content" id="medicines">
        <div className="catalog-heading">
          <div>
            <p className="section-kicker">{isCatalogPage ? 'SHOP BY CATEGORY' : 'POPULAR PICKS'}</p>
            <h2>{isWishlistPage ? 'Your wishlist' : isCatalogPage ? (categoryLabels[activeCategory] || activeCategory) : 'Popular products'}</h2>
            <p className="section-description">{isWishlistPage ? 'Products you saved for later.' : isCatalogPage ? `Browse ${categoryLabels[activeCategory] || activeCategory.toLowerCase()} available from MediNest.` : 'Everyday products for you and your family.'}</p>
          </div>
          {isWishlistPage
            ? <a className="text-link" href="/">Continue shopping <span aria-hidden="true">→</span></a>
            : isCatalogPage
            ? <a className="text-link" href="/">Back to shop all <span aria-hidden="true">→</span></a>
            : <a className="text-link" href="/?category=Medicines">See all <span aria-hidden="true">→</span></a>}
        </div>
        {!isWishlistPage && <div className="category-chips" aria-label="Browse product categories">
          {categories.map((category) => <a key={category} className={`category-chip${activeCategory === category ? ' active' : ''}`} href={getCategoryHref(category)} aria-current={activeCategory === category ? 'page' : undefined}>{categoryLabels[category] || category}</a>)}
          {activeBrand && <button className="category-chip clear-filter" type="button" onClick={() => setActiveBrand('')}>Brand: {activeBrand} ×</button>}
        </div>}
        <div className="medicine-grid">
          {catalogLoading && <p className="empty-message">Loading products…</p>}
          {filteredMedicines.map((medicine) => (
            <article className="medicine-card" key={medicine.id}>
              <div className="product-art">
                <img src={medicine.image} alt={medicine.name} loading="lazy" />
                <small>{categoryLabels[medicine.category] || medicine.category}</small>
                <button
                  type="button"
                  className={`wishlist-toggle${wishlistIds.includes(medicine.id) ? ' saved' : ''}`}
                  onClick={() => toggleWishlist(medicine.id)}
                  aria-label={wishlistIds.includes(medicine.id) ? `Remove ${medicine.name} from wishlist` : `Add ${medicine.name} to wishlist`}
                  aria-pressed={wishlistIds.includes(medicine.id)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" /></svg>
                </button>
              </div>
              <span className="product-badge">{medicine.badge}</span>
              <p className="product-category">{medicine.brand} · {categoryLabels[medicine.category] || medicine.category}</p><h3>{medicine.name}</h3><p className="product-detail">{medicine.detail}</p>
              <div className="product-rating"><span>{medicine.stock > 0 ? 'In stock' : 'Out of stock'}</span>{medicine.requiresPrescription && <small>Prescription required</small>}</div>
              <div className="medicine-card-footer"><div><strong>{formatINR(medicine.price)}</strong>{medicine.oldPrice > medicine.price && <del>{formatINR(medicine.oldPrice)}</del>}</div><button type="button" disabled={medicine.stock < 1} onClick={() => addToCart(medicine)}><span aria-hidden="true">+</span> Add to cart</button></div>
            </article>
          ))}
        </div>
        {!catalogLoading && filteredMedicines.length === 0 && (
          <p className="empty-message">
            {isWishlistPage && wishlistIds.length === 0
              ? 'Your wishlist is empty. Tap the heart on a product to save it here.'
              : search.trim()
              ? `No products match “${search.trim()}”.`
              : `No ${isCatalogPage ? categoryLabels[activeCategory] || activeCategory.toLowerCase() : 'products'} are available yet.`}
          </p>
        )}
      </section>

      {apiError && <p className="prescription-note" role="alert">{apiError}</p>}

      <section className="conditions-section" id="conditions">
        <div className="section-heading"><h2>Shop by health issue</h2><a href="#medicines">View all <span aria-hidden="true">›</span></a></div>
        <div className="condition-grid">
          {conditions.map((condition) => (
            <button className="condition-card" key={condition.name} type="button" onClick={() => { setSearch(condition.name.toLowerCase().includes('pain') ? 'pain' : ''); document.getElementById('medicines')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <span className={`condition-icon ${condition.color}`} aria-hidden="true">{condition.icon}</span>
              <span>{condition.name}</span><span className="condition-arrow" aria-hidden="true">›</span>
            </button>
          ))}
        </div>
      </section>

      <section className="refill-planner" id="refills" aria-labelledby="refill-title">
        <div className="refill-intro">
          <span className="refill-icon" aria-hidden="true">↻</span>
          <p className="section-kicker">MEDICINE REMINDERS</p>
          <h2 id="refill-title">Remember when to buy again.</h2>
          <p>Choose a product and when to remind you. Your reminders are saved on this device.</p>
        </div>
        <div className="refill-content">
          <form className="refill-form" onSubmit={addRefillReminder}>
            <label>
              Choose a product
              <select value={reminderMedicineId} onChange={(event) => setReminderMedicineId(event.target.value)} disabled={!medicines.length}>
                <option value="" disabled>Select a product</option>
                {medicines.map((medicine) => <option key={medicine.id} value={medicine.id}>{medicine.name}</option>)}
              </select>
            </label>
            <label>
              Remind me after
              <span className="days-input"><input type="number" min="1" max="180" value={reminderDays} onChange={(event) => setReminderDays(event.target.value)} required /><span>days</span></span>
            </label>
            <button type="submit" disabled={!medicines.length}>Save reminder</button>
          </form>
          <div className="reminder-list" aria-live="polite">
            {reminders.length === 0 ? (
              <p className="reminder-empty">Your reminders will show here.</p>
            ) : reminders.map((reminder) => (
              <div className="reminder-row" key={reminder.id}>
                <span className="reminder-check" aria-hidden="true">✓</span>
                <span className="reminder-name"><strong>{reminder.name}</strong><small>Reminder · {reminder.dueDate}</small></span>
                <button type="button" onClick={() => setReminders((current) => current.filter((item) => item.id !== reminder.id))} aria-label={`Remove ${reminder.name} reminder`}>×</button>
              </div>
            ))}
          </div>
          <p className="refill-disclaimer">This is only a reminder. Follow your doctor's advice and the directions on the pack.</p>
        </div>
      </section>

      <section className="prescription-panel" id="upload-prescription" aria-labelledby="prescription-title">
        <div className="section-heading">
          <div><p className="section-kicker">SECURE MEDICINE REVIEW</p><h2 id="prescription-title">Submit a prescription</h2></div>
        </div>
        {token ? <>
          <p>Choose the prescription-required product and upload a PDF, JPEG, or PNG (up to 5 MB). The file is stored privately and reviewed by an administrator.</p>
          <form className="prescription-upload-form" onSubmit={uploadPrescription}>
            <label>Product
              <select name="productId" value={prescriptionProductId} onChange={(event) => setPrescriptionProductId(event.target.value)} required>
                <option value="">Select a product</option>
                {prescriptionProducts.map((product) => <option key={product._id} value={product._id}>{product.name}</option>)}
              </select>
            </label>
            <label>Prescription file
              <input name="prescriptionFile" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required />
            </label>
            <button className="checkout-button" type="submit" disabled={isSubmitting || prescriptionProducts.length === 0}>
              {isSubmitting ? 'Uploading…' : 'Upload for review'}
            </button>
          </form>
          {prescriptionFeedback && <p className="prescription-note" role="status">{prescriptionFeedback}</p>}
          <div className="prescription-list">
            <h3>Your submissions</h3>
            {prescriptions.length === 0 && <p>No prescriptions submitted yet.</p>}
            {prescriptions.map((prescription) => (
              <article className="prescription-row" key={prescription._id}>
                <div>
                  <strong>{prescription.productId?.name || 'Product'}</strong>
                  <small>{prescription.status} · {new Date(prescription.createdAt).toLocaleDateString()}</small>
                  {prescription.reviewNote && <small>Review note: {prescription.reviewNote}</small>}
                </div>
                <button type="button" onClick={() => downloadPrescription(prescription._id)}>Download</button>
              </article>
            ))}
          </div>
        </> : <div className="prescription-signin">
          <p>Sign in to securely submit a prescription and check its review status.</p>
          <button className="checkout-button" type="button" onClick={() => { setAuthMode('login'); setAuthFeedback(''); setIsAuthOpen(true) }}>Sign in to continue</button>
        </div>}
      </section>

      <section className="brand-section" id="brands" aria-labelledby="brand-title">
        <div className="section-heading"><h2 id="brand-title">Shop by brand</h2><a className="text-link" href="/">Shop all products <span aria-hidden="true">›</span></a></div>
        <div className="brand-grid">
          {brands.map((brand, index) => <a className="brand-card" key={brand} href={`/?brand=${encodeURIComponent(brand)}`}><span className={`brand-logo brand-logo-${index + 1}`}>{brand.split(' ').map((word) => word[0]).join('').replace('&', '')}</span><strong>{brand}</strong></a>)}
        </div>
      </section>

      <section className="orders-section" id="orders" aria-labelledby="orders-title">
        <div className="section-heading"><div><p className="section-kicker">YOUR ACTIVITY</p><h2 id="orders-title">{userRole === 'admin' ? 'All orders' : 'Your recent orders'}</h2></div><span className="order-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span></div>
        {!token ? <div className="orders-empty"><span aria-hidden="true"><CartIcon /></span><p>Sign in to view your orders.</p><button type="button" onClick={() => setIsAuthOpen(true)}>Sign in</button></div> : orders.length === 0 ? <div className="orders-empty"><span aria-hidden="true"><CartIcon /></span><p>Your orders will show here after you place an order.</p><a href="/">Shop products</a></div> : <div className="orders-list">{orders.map((order) => <article className="order-card" key={order._id}><div className="order-card-heading"><div><small>ORDER {String(order._id).slice(-8).toUpperCase()}</small><strong>{order.status}</strong></div><span className="order-status">{order.paymentMethod} · {order.paymentStatus}</span></div><p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p><p>{order.deliveryAddress?.streetAddress}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.postalCode}</p><div className="order-card-footer"><span>{new Date(order.createdAt).toLocaleDateString('en-IN')} · {formatINR(order.totalAmount)}</span><button type="button" onClick={() => reorder(order.items)}>Buy again</button>{order.status !== 'Delivered' && order.status !== 'Cancelled' && <button type="button" onClick={() => cancelOrder(order._id)}>Cancel</button>}{userRole === 'admin' && <select aria-label={`Update status for order ${order._id}`} value={order.status} onChange={(event) => updateOrderStatus(order._id, event.target.value)}><option>Order Placed</option><option>Processing</option><option>Shipped</option><option>Delivered</option></select>}</div></article>)}</div>}
      </section>

      {token && <section className="profile-section" id="profile" aria-labelledby="profile-title">
        <div className="section-heading"><div><p className="section-kicker">ACCOUNT</p><h2 id="profile-title">Your profile and addresses</h2></div></div>
        <form className="profile-form" onSubmit={saveProfile}>
          <label>Name<input value={profileName} onChange={(event) => setProfileName(event.target.value)} required /></label>
          <button type="submit">Save profile</button>
        </form>
        {profileFeedback && <p className="prescription-note" role="status">{profileFeedback}</p>}
        <div className="saved-addresses">
          {addresses.map((address) => <details className="saved-address" key={address._id}>
            <summary>{address.label}: {address.streetAddress}, {address.city}{address.isDefault ? ' · Default' : ''}</summary>
            <div className="address-actions">
              {!address.isDefault && <button type="button" onClick={() => setDefaultAddress(address._id)}>Make default</button>}
              <button type="button" onClick={() => deleteSavedAddress(address._id)}>Delete</button>
            </div>
            <form className="profile-form address-edit-form" onSubmit={(event) => updateSavedAddress(event, address._id)}>
              <label>Label<input name="label" defaultValue={address.label} required /></label>
              <label>Name<input name="fullName" defaultValue={address.fullName} required /></label>
              <label>Phone<input name="phone" defaultValue={address.phone} pattern="[0-9]{10}" required /></label>
              <label>Street address<input name="streetAddress" defaultValue={address.streetAddress} required /></label>
              <label>Locality<input name="locality" defaultValue={address.locality} /></label>
              <label>City<input name="city" defaultValue={address.city} required /></label>
              <label>State<input name="state" defaultValue={address.state} required /></label>
              <label>PIN code<input name="postalCode" defaultValue={address.postalCode} pattern="[1-9][0-9]{5}" required /></label>
              <label>Country<input name="country" defaultValue={address.country} required /></label>
              <button type="submit">Update address</button>
            </form>
          </details>)}
          {addresses.length === 0 && <p>No saved delivery addresses yet. Save one during checkout.</p>}
        </div>
      </section>}

      {userRole === 'admin' && (
        <section className="admin-section" id="admin" aria-labelledby="admin-title">
          <div className="section-heading"><div><p className="section-kicker">ADMINISTRATION</p><h2 id="admin-title">Manage products and users</h2></div></div>
          <form className="admin-product-form" onSubmit={addProduct}>
            <h3>Add product</h3>
            <label>Name<input name="name" required /></label>
            <label>Description<input name="description" required /></label>
            <label>Brand<input name="brand" required /></label>
            <label>Category<input name="category" required /></label>
            <label>Price (INR)<input name="price" type="number" min="0" step="0.01" required /></label>
            <label>Old price<input name="oldPrice" type="number" min="0" step="0.01" /></label>
            <label>Stock<input name="stock" type="number" min="0" step="1" required /></label>
            <label className="save-address-option"><input name="requiresPrescription" type="checkbox" />Requires prescription</label>
            <button className="checkout-button" type="submit">Add product</button>
          </form>
          {adminFeedback && <p className="prescription-note" role="status">{adminFeedback}</p>}
          <div className="admin-inventory">
            <h3>Inventory</h3>
            {inventory.map((product) => (
              <article className="admin-inventory-row" key={product._id}>
                <div><strong>{product.name}</strong><small>{product.brand} · {product.category} · {product.isActive ? 'Active' : 'Inactive'}</small></div>
                <label>Price<input type="number" min="0" step="0.01" value={product.price} onChange={(event) => updateInventoryField(product._id, 'price', event.target.value)} /></label>
                <label>Stock<input type="number" min="0" step="1" value={product.stock} onChange={(event) => updateInventoryField(product._id, 'stock', event.target.value)} /></label>
                <button type="button" onClick={() => updateProduct(product)}>Save</button>
                {product.isActive ? <button type="button" onClick={() => deactivateProduct(product._id)}>Deactivate</button> : <button type="button" onClick={() => activateProduct(product._id)}>Activate</button>}
              </article>
            ))}
          </div>
          <div className="admin-users">
            <h3>Users</h3>
            {adminUsers.map((user) => <p key={user._id}>{user.name} · {user.email} · {user.role}</p>)}
          </div>
          <div className="admin-prescriptions">
            <h3>Prescription review queue</h3>
            {adminPrescriptions.length === 0 && <p>No prescriptions are awaiting review.</p>}
            {adminPrescriptions.map((prescription) => (
              <article className="prescription-row" key={prescription._id}>
                <div>
                  <strong>{prescription.productId?.name || 'Product'}</strong>
                  <small>{prescription.userId?.name} · {prescription.userId?.email}</small>
                  <small>Submitted {new Date(prescription.createdAt).toLocaleDateString()}</small>
                </div>
                <button type="button" onClick={() => downloadPrescription(prescription._id, true)}>Download file</button>
                <button type="button" onClick={() => reviewPrescription(prescription._id, 'Approved')}>Approve</button>
                <button type="button" onClick={() => reviewPrescription(prescription._id, 'Rejected')}>Reject</button>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="recommendation-signin" aria-labelledby="recommendation-title">
        <h2 id="recommendation-title">{token ? 'Welcome back to MediNest' : 'See your MediNest recommendations'}</h2>
        <p>{token ? 'Browse health essentials picked for your everyday care.' : 'Sign in to see recommendations and keep your shopping in one place.'}</p>
        {token
          ? <a className="recommendation-button" href="/?category=Medicines">Continue shopping</a>
          : <button className="recommendation-button" type="button" onClick={() => { setAuthMode('login'); setAuthFeedback(''); setIsAuthOpen(true) }}>Sign in</button>}
        {!token && <p className="recommendation-new">New to MediNest? <button type="button" onClick={() => { setAuthMode('register'); setAuthFeedback(''); setIsAuthOpen(true) }}>Create your account</button></p>}
      </section>
      <a className="back-to-top" href="/">Back to top</a>
      <footer className="store-footer">
        <div className="footer-link-columns">
          <section><h2>Get to know MediNest</h2><a href="#conditions">Health and wellness</a><a href="#services">Our services</a><a href="#top">About MediNest</a></section>
          <section><h2>Shop with us</h2><a href="/?category=Medicines">Medicines</a><a href="/?category=Vitamins">Vitamins & nutrition</a><a href="/?category=Personal%20care">Personal care</a></section>
          <section><h2>Your account</h2><a href="/?view=cart">Your cart</a><a href="/?view=orders">Your orders</a><a href="#profile">Your profile</a><a href="#upload-prescription">Prescriptions</a></section>
          <section><h2>Let us help you</h2><a href="/?view=orders">Order support</a><a href="#top">Delivery information</a><a href="#top">Help and FAQs</a></section>
        </div>
        <div className="footer-brand-row">
          <a className="brand footer-brand" href="/"><BrandMark /><span>Medi<span>Nest</span></span></a>
          <p>Everyday health, made a little easier.</p>
          <small>Follow the directions on the pack and your doctor's advice.</small>
        </div>
      </footer>

      {cartCount > 0 && !isCartPage && <div className="sticky-cart"><span className="sticky-cart-icon" aria-hidden="true"><CartIcon /></span><div className="sticky-cart-summary"><strong>{formatINR(cartTotal)}</strong><small>{cartCount} {cartCount === 1 ? 'item' : 'items'} added</small></div><a href="/?view=cart">View Cart</a></div>}

      {isCartPage && (
        <section className="cart-page-panel" aria-label="Shopping cart">
          <div className="cart-panel-heading"><div><p className="section-kicker">YOUR SHOPPING BAG</p><h2>Your Cart <span>({cartCount})</span></h2></div><a className="text-link" href="/">Continue shopping</a></div>
          {orderPlaced ? <p className="order-success" role="status">Order {placedOrderId} placed successfully with Cash on Delivery.</p> : cart.length === 0 ? <div className="empty-cart"><span aria-hidden="true"><CartIcon /></span><p>Your cart is empty.</p></div> : <>
            <ul className="cart-items">{cart.map((item) => <li className="cart-item" key={item.id}><div><strong>{item.name}</strong><p>{formatINR(item.price)} each</p></div><div className="quantity-controls"><button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button><span>{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button></div></li>)}</ul>
            <div className="cart-total"><span>Subtotal</span><strong>{formatINR(cartTotal)}</strong></div><p className="delivery-note">Cash on Delivery · No online payment is collected.</p>
            <button className="checkout-button" type="button" onClick={openCheckout}>Enter delivery details</button>
            {isCheckoutOpen && <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
              <h3>Where should we deliver?</h3>
              {addresses.length > 0 && <label>Saved address<select value={selectedAddressId} onChange={(event) => setSelectedAddressId(event.target.value)}><option value="">Enter a new address</option>{addresses.map((address) => <option key={address._id} value={address._id}>{address.label}: {address.streetAddress}, {address.city}</option>)}</select></label>}
              {!selectedAddressId && <>
                <label>Your name<input name="fullName" type="text" autoComplete="name" required /></label>
                <label>Phone number<input name="phone" type="tel" autoComplete="tel" pattern="[0-9]{10}" title="Enter a 10-digit phone number" required /></label>
                <label>Address<textarea name="streetAddress" autoComplete="street-address" rows="2" required /></label>
                <label>City<input name="city" type="text" required /></label>
                <label>State<input name="state" type="text" required /></label>
                <label>PIN code<input name="postalCode" type="text" inputMode="numeric" pattern="[1-9][0-9]{5}" title="Enter a valid 6-digit PIN code" required /></label>
                <label className="save-address-option"><input name="saveAddress" type="checkbox" />Save this address to my account</label>
              </>}
              <p>Payment method: Cash on Delivery</p>
              {apiError && <p role="alert">{apiError}</p>}
              <button className="checkout-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Placing order…' : `Place order · ${formatINR(cartTotal)}`}</button>
            </form>}
          </>}
        </section>
      )}

      {isAuthOpen && (
        <div className="auth-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsAuthOpen(false)
        }}>
          <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button className="auth-close" type="button" onClick={() => setIsAuthOpen(false)} aria-label="Close sign in">×</button>
            <span className="auth-mark" aria-hidden="true">+</span>
            <p className="section-kicker">WELCOME TO MEDINEST</p>
            <h2 id="auth-title">{authMode === 'login' ? 'Welcome back.' : authMode === 'register' ? 'Create your account.' : authMode === 'forgot' ? 'Reset your password.' : authMode === 'verify' ? 'Check your email.' : 'Choose a new password.'}</h2>
            <p className="auth-subtitle">{authMode === 'login' ? 'Sign in to view your cart, orders and account.' : authMode === 'register' ? 'Create an account to shop with MediNest.' : 'Follow the secure reset steps sent to your registered email.'}</p>
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'register' && <label>Your name<input name="fullName" type="text" autoComplete="name" placeholder="Your name" required /></label>}
              <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} required /></label>
              {(authMode === 'verify' || authMode === 'reset') && <label>6-digit code<input name="otp" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" autoComplete="one-time-code" value={resetOtp} onChange={(event) => setResetOtp(event.target.value)} required /></label>}
              {(authMode === 'login' || authMode === 'register') && <label>Password<input name="password" type="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength={8} placeholder="At least 8 characters" required /></label>}
              {authMode === 'reset' && <>
                <label>New password<input name="newPassword" type="password" autoComplete="new-password" minLength={8} required /></label>
                <label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></label>
              </>}
              <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : authMode === 'login' ? 'Sign in' : authMode === 'register' ? 'Create account' : authMode === 'forgot' ? 'Send reset code' : authMode === 'verify' ? 'Verify code' : 'Reset password'}</button>
            </form>
            {(authMode === 'verify' || authMode === 'reset') && (
              <p className="auth-switch">
                {authMode === 'verify' ? 'Didn’t receive the code?' : 'Code expired?'}
                {' '}
                <button type="button" onClick={resendResetCode} disabled={isSubmitting || otpResendCountdown > 0}>
                  {otpResendCountdown > 0
                    ? `Resend in ${Math.floor(otpResendCountdown / 60)}:${String(otpResendCountdown % 60).padStart(2, '0')}`
                    : 'Resend code'}
                </button>
              </p>
            )}
            {authFeedback && <p className="auth-switch" role="status">{authFeedback}</p>}
            <p className="auth-switch">
              {authMode === 'login' && <>New to MediNest? <button type="button" onClick={() => { setAuthMode('register'); setAuthFeedback('') }}>Create account</button> · <button type="button" onClick={() => { setAuthMode('forgot'); setAuthFeedback('') }}>Forgot password?</button></>}
              {authMode === 'register' && <>Already have an account? <button type="button" onClick={() => { setAuthMode('login'); setAuthFeedback('') }}>Sign in</button></>}
              {['forgot', 'verify', 'reset'].includes(authMode) && <button type="button" onClick={() => { setAuthMode('login'); setAuthFeedback('') }}>Back to sign in</button>}
            </p>
            <small className="auth-demo-note">Your account actions are handled by the MediNest API.</small>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
