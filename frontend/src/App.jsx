import { useEffect, useRef, useState } from 'react'
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
import medicineImage from './assets/products/medicine.jpg'
import hairCareImage from './assets/products/hair-care.jpg'
import oralCareImage from './assets/products/oral-care.jpg'
import medicalDeviceImage from './assets/products/medical-device.jpg'
import medicineTabletsImage from './assets/products/medicine-tablets.jpg'
import vitaminsCategoryImage from './assets/products/vitamins-category.jpg'
import herbalProductsImage from './assets/products/herbal-products.jpg'
import babyCareImage from './assets/products/baby-care.jpg'
import selfCareImage from './assets/products/self-care.jpg'
import wellnessImage from './assets/products/wellness.jpg'

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
  pharmacyOrangePillImage,
  pharmacyVialsImage,
  pharmacyMoleculeImage,
  pharmacyLabImage,
]
const deviceProductImages = [
  medicalDeviceImage,
  medicineImage,
  pharmacyLabImage,
]
const categoryProductImages = {
  medicines: medicineProductImages,
  vitamins: wellnessProductImages,
  wellness: wellnessProductImages,
  'personal care': [selfCareImage, skincareProductImage, wellnessImage],
  'baby products': [babyCareImage, selfCareImage, skincareProductImage],
  ayurveda: [herbalProductsImage, pharmacyCapsuleImage, wellnessImage, pharmacyBottleImage],
  devices: deviceProductImages,
  'oral care': [oralCareImage, skincareProductImage, pharmacyBottleImage],
  'hair care': [hairCareImage, skincareProductImage, selfCareImage],
}
const OTP_RESEND_DELAY_SECONDS = 60
const HERO_SLIDE_INTERVAL_MS = 2000

const homeCategories = [
  {
    eyebrow: 'THE MEDICINE CABINET',
    title: 'Medicines',
    detail: 'Trusted essentials for your everyday needs.',
    category: 'Medicines',
    image: medicineTabletsImage,
  },
  {
    eyebrow: 'NOURISH YOUR ROUTINE',
    title: 'Vitamins & nutrition',
    detail: 'A little support for the habits you keep.',
    category: 'Vitamins',
    image: pharmacyOrangePillImage,
  },
  {
    eyebrow: 'TIME FOR YOURSELF',
    title: 'Personal care',
    detail: 'Considered care for skin, hair and body.',
    category: 'Personal care',
    image: selfCareImage,
  },
  {
    eyebrow: 'FEEL BETTER PREPARED',
    title: 'Health at home',
    detail: 'Useful tools for everyday peace of mind.',
    category: 'Devices',
    image: medicalDeviceImage,
  },
]

const homeShopCategories = [
  { category: 'Medicines', image: medicineTabletsImage },
  { category: 'Vitamins', image: vitaminsCategoryImage },
  { category: 'Wellness', image: wellnessImage },
  { category: 'Personal care', image: selfCareImage },
  { category: 'Baby products', image: babyCareImage },
  { category: 'Ayurveda', image: herbalProductsImage },
  { category: 'Devices', image: medicalDeviceImage },
  { category: 'Oral care', image: oralCareImage },
]

const homeHealthArticles = [
  {
    category: 'MEDICINE CABINET',
    title: 'A few simple ways to organize home medicines',
    summary: 'Keep products in their original packs, check expiry dates, and follow the storage directions on each label.',
    image: medicineTabletsImage,
    link: getCategoryHref('Medicines'),
    linkText: 'Shop medicines',
  },
  {
    category: 'EVERYDAY WELLNESS',
    title: 'Build a wellness routine that works for you',
    summary: 'Small, consistent habits can make daily self-care easier to maintain.',
    image: wellnessImage,
    link: getCategoryHref('Wellness'),
    linkText: 'Explore wellness',
  },
  {
    category: 'CARE AT HOME',
    title: 'Choosing health tools for home',
    summary: 'Compare product details and use health devices according to the supplied instructions.',
    image: medicalDeviceImage,
    link: getCategoryHref('Devices'),
    linkText: 'Browse health tools',
  },
  {
    category: 'PERSONAL CARE',
    title: 'Make room for a simple self-care routine',
    summary: 'Find everyday personal-care essentials for the routines that suit you.',
    image: selfCareImage,
    link: getCategoryHref('Personal care'),
    linkText: 'Explore personal care',
  },
]

const homeHeroSlides = [
  {
    image: vitaminsCategoryImage,
    alt: 'Citrus fruits and vitamins for everyday wellness',
    caption: 'Small steps, brighter days',
  },
  {
    image: pharmacyPillsImage,
    alt: 'A selection of medicines and tablets',
    caption: 'Everyday medicine essentials',
  },
  {
    image: herbalProductsImage,
    alt: 'Herbal wellness products and natural ingredients',
    caption: 'A little room for natural care',
  },
  {
    image: medicalDeviceImage,
    alt: 'Health tools for caring for yourself at home',
    caption: 'Feel prepared at home',
  },
  {
    image: selfCareImage,
    alt: 'Gentle personal care products for a daily routine',
    caption: 'Make time for your own care',
  },
]

function getProductImage(category = '', productKey = '') {
  const normalizedCategory = category.toLowerCase()
  const images = categoryProductImages[normalizedCategory] || medicineProductImages

  const imageIndex = Array.from(`${normalizedCategory}:${String(productKey).toLowerCase()}`).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    0
  ) % images.length
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

const categories = ['Medicines', 'Vitamins', 'Wellness', 'Personal care', 'Baby products', 'Ayurveda', 'Devices', 'Oral care', 'Hair care']
const categoryLabels = { Wellness: 'Health products', Ayurveda: 'Herbal products', Devices: 'Health tools' }
const paymentMethodLabels = {
  COD: 'Cash on Delivery',
  UPI_ON_DELIVERY: 'UPI at delivery',
  CARD_ON_DELIVERY: 'Card at delivery',
}
const pageParams = new URLSearchParams(window.location.search)
const requestedCategory = pageParams.get('category')
const isCartPage = pageParams.get('view') === 'cart'
const isWishlistPage = pageParams.get('view') === 'wishlist'
const isOrdersPage = pageParams.get('view') === 'orders'
const isPrescriptionPage = pageParams.get('view') === 'prescriptions'
const isAccountPage = pageParams.get('view') === 'account'
const initialBrand = pageParams.get('brand') || ''
const initialCategory = categories.includes(requestedCategory)
  ? requestedCategory
  : pageParams.get('view') === 'brands' ? 'Medicines' : 'All products'
function getCategoryHref(category) {
  return category === 'All products' ? '/' : `/?category=${encodeURIComponent(category)}`
}

const conditions = [
  { name: 'Diabetes', searchTerms: ['glucose'], image: medicalDeviceImage, color: 'mint' },
  { name: 'Heart health', searchTerms: ['blood pressure'], image: medicalDeviceImage, color: 'lavender' },
  { name: 'Stomach health', searchTerms: ['antacid', 'rehydration', 'ORS'], image: pharmacyOrangePillImage, color: 'peach' },
  { name: 'Pain relief', searchTerms: ['pain', 'paracetamol'], image: pharmacyPillsImage, color: 'blue' },
  { name: 'Liver health', searchTerms: ['liver'], image: herbalProductsImage, color: 'rose' },
]

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="brand-sprout">
          <path d="M22 26v-9" stroke="#F5F7F1" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M22 21c-5.8 0-8.2-2.5-8.2-6.2 5.3 0 8.2 2 8.2 6.2Z" fill="#A8D9C1" />
          <path d="M22 18.5c0-4.4 2.5-7 7.7-7-.1 4.4-2.6 7-7.7 7Z" fill="#D5E9A9" />
        </g>
        <path d="M11 27c2.2 4.4 5.9 6.7 11 6.7S30.8 31.4 33 27" stroke="#F5F7F1" strokeWidth="2" strokeLinecap="round" />
        <path d="M14.5 31.5c2 2.4 4.5 3.6 7.5 3.6s5.5-1.2 7.5-3.6" stroke="#A8D9C1" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  )
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

const brandLogoMarks = [
  <g key="hair" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4"><path d="M47 14c-7 5-7 13 0 18" /><path d="M56 11c-8 7-8 17 0 23" /><path d="M65 11c8 7 8 17 0 23" /><path d="M74 14c7 5 7 13 0 18" /></g>,
  <path key="oral" d="M48 13c4-5 10-3 12 0 2-3 8-5 12 0 5 6-1 13-3 19-1 4-4 5-6 2l-3-7-3 7c-2 3-5 2-6-2-2-6-8-13-3-19Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.4" />,
  <g key="tools" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4"><path d="M47 13v8a13 13 0 0 0 26 0v-8" /><path d="M47 13h7v8h-7zm19 0h7v8h-7z" /><path d="M60 34v-4a5 5 0 0 1 5-5h3" /><circle cx="70" cy="25" r="2" /></g>,
  <g key="ayurveda" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4"><path d="M60 34V15" /><path d="M60 25c-10 0-15-5-15-12 9 0 15 3 15 12Z" /><path d="M60 21c0-9 5-13 15-13 0 8-5 13-15 13Z" /></g>,
  <path key="baby" d="M60 33S45 24 45 16a7 7 0 0 1 13-4 7 7 0 0 1 13 4c0 8-11 15-11 15Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.4" />,
  <path key="care" d="M60 9C54 18 48 23 48 29a12 12 0 0 0 24 0c0-6-6-11-12-20Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.4" />,
  <g key="wellness" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="60" cy="21" r="4" /><ellipse cx="60" cy="12" rx="4" ry="7" /><ellipse cx="60" cy="30" rx="4" ry="7" /><ellipse cx="51" cy="21" rx="7" ry="4" /><ellipse cx="69" cy="21" rx="7" ry="4" /></g>,
  <g key="nutrition" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4"><path d="M60 34V12" /><path d="M60 17c-7 0-10-3-10-8 7 0 10 3 10 8Zm0 7c7 0 10-3 10-8-7 0-10 3-10 8Zm0-1c-7 0-10-3-10-8 7 0 10 3 10 8Z" /></g>,
  <g key="essentials" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M51 12h18a9 9 0 0 1 0 18H51a9 9 0 0 1 0-18Z" /><path d="m57 13 12 16" /></g>,
]

function BrandLogo({ brand, index }) {
  const initials = brand.split(' ').map((word) => word[0]).join('').replace('&', '')
  return (
    <svg className={`brand-logo brand-logo-${index + 1}`} viewBox="0 0 120 100" role="img" aria-label={`${brand} logo`}>
      {brandLogoMarks[index % brandLogoMarks.length]}
      <text x="60" y="77" textAnchor="middle">{initials}</text>
    </svg>
  )
}

function ThermometerIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z" /><path d="M11 11v7" /></svg>
}

function App() {
  const [search, setSearch] = useState('')
  const [activeHealthIssue, setActiveHealthIssue] = useState('')
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)
  const heroTouchStart = useRef(null)
  const healthIssueScrollerRef = useRef(null)
  const deliveryPincodeInputRef = useRef(null)
  const activeCategory = initialCategory
  const [activeBrand, setActiveBrand] = useState(initialBrand)
  const isMedicinesCategory = initialCategory === 'Medicines'
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
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [checkoutKey, setCheckoutKey] = useState('')
  const [inventory, setInventory] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [adminFeedback, setAdminFeedback] = useState('')
  const [prescriptionProducts, setPrescriptionProducts] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [adminPrescriptions, setAdminPrescriptions] = useState([])
  const [prescriptionProductId, setPrescriptionProductId] = useState('')
  const [prescriptionFeedback, setPrescriptionFeedback] = useState('')
  const [prescriptionProductsLoading, setPrescriptionProductsLoading] = useState(true)
  const [prescriptionProductsError, setPrescriptionProductsError] = useState('')
  const [isPrescriptionFormOpen, setIsPrescriptionFormOpen] = useState(false)
  const [deliveryPincode, setDeliveryPincode] = useState(() => window.localStorage.getItem('medinest-delivery-pincode') || '')
  const [deliveryPincodeDraft, setDeliveryPincodeDraft] = useState('')
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [locationPickerError, setLocationPickerError] = useState('')
  const [apiError, setApiError] = useState('')
  const [authFeedback, setAuthFeedback] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [resetOtp, setResetOtp] = useState('')
  const authResetBackdropRef = useRef(null)
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
    if (isAuthOpen && authMode === 'reset') {
      authResetBackdropRef.current?.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [authMode, isAuthOpen])

  useEffect(() => {
    if (!isLocationPickerOpen) return undefined

    deliveryPincodeInputRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsLocationPickerOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLocationPickerOpen])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % homeHeroSlides.length)
    }, HERO_SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let active = true
    const timer = window.setTimeout(async () => {
      setCatalogLoading(true)
      setApiError('')
      try {
        const selectedCondition = conditions.find((condition) => condition.name === activeHealthIssue)
        const searchTerms = selectedCondition?.searchTerms || [search.trim()]
        const productsByTerm = await Promise.all(searchTerms.map(async (term) => {
          const params = new URLSearchParams()
          if (term) params.set('search', term)
          if (activeCategory !== 'All products') params.set('category', activeCategory)
          if (activeBrand) params.set('brand', activeBrand)
          const query = params.toString()
          const result = await apiRequest(`/products${query ? `?${query}` : ''}`)
          return result.products || []
        }))
        if (active) {
          const products = [...new Map(productsByTerm.flat().map((product) => [product._id, product])).values()]
          setMedicines(products.map(mapProduct))
          if (!search.trim() && !activeHealthIssue && activeCategory === 'All products' && !activeBrand) {
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
  }, [search, activeHealthIssue, activeCategory, activeBrand])

  useEffect(() => {
    if (!isMedicinesCategory) return undefined

    let active = true
    apiRequest('/products?category=Medicines')
      .then((result) => {
        if (active) {
          setBrands([...new Set((result.products || []).map((product) => product.brand).filter(Boolean))])
        }
      })
      .catch((error) => {
        if (active) setApiError(error.message)
      })

    return () => { active = false }
  }, [isMedicinesCategory])

  useEffect(() => {
    let active = true
    apiRequest('/products')
      .then((result) => {
        if (active) setPrescriptionProducts(result.products || [])
      })
      .catch((error) => {
        if (active) setPrescriptionProductsError(error.message)
      })
      .finally(() => {
        if (active) setPrescriptionProductsLoading(false)
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
  const homeHealthProducts = medicines.filter((medicine) => medicine.stock > 0).slice(0, 4)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const isCatalogPage = initialCategory !== 'All products'
    || isCartPage
    || isWishlistPage
    || isOrdersPage
    || isPrescriptionPage
    || isAccountPage
    || Boolean(initialBrand)
  const prescriptionHref = '/?view=prescriptions'

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

  async function saveDeliveryAddress(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const address = Object.fromEntries(
      ['label', 'fullName', 'phone', 'streetAddress', 'locality', 'city', 'state', 'postalCode', 'country']
        .map((field) => [field, formData.get(field).toString().trim()])
    )
    setProfileFeedback('')
    try {
      const result = await apiRequest('/users/me/addresses', {
        method: 'POST',
        token,
        body: address,
      })
      const savedAddresses = result.addresses || []
      setAddresses(savedAddresses)
      setSelectedAddressId(savedAddresses.find((item) => item.isDefault)?._id || '')
      setProfileFeedback('Delivery address saved.')
      form.reset()
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
      setPrescriptionFeedback('Choose a medicine and prescription file.')
      return
    }
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const supportedImageExtensions = new Set([
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tif', 'tiff', 'avif', 'heic', 'heif',
    ])
    const isPdf = file.type === 'application/pdf' || fileExtension === 'pdf'
    const isImage = (file.type.startsWith('image/') && file.type !== 'image/svg+xml')
      || supportedImageExtensions.has(fileExtension)
    if (
      file.size > 5 * 1024 * 1024
      || (!isPdf && !isImage)
    ) {
      setPrescriptionFeedback('Choose a PDF or supported image file (JPEG, PNG, GIF, WebP, BMP, TIFF, AVIF, or HEIC) that is 5 MB or smaller.')
      return
    }

    setIsSubmitting(true)
    setPrescriptionFeedback('')
    try {
      const result = await apiRequest(`/prescriptions/${productId}`, {
        method: 'POST',
        token,
        headers: { 'Content-Type': 'application/octet-stream' },
        body: file,
      })
      form.reset()
      setPrescriptionProductId('')
      if (result.prescription) {
        setPrescriptions((current) => [
          result.prescription,
          ...current.filter((prescription) => prescription._id !== result.prescription._id),
        ])
      }
      setPrescriptionFeedback('Successfully submitted! Your prescription is now awaiting review.')
      try {
        await refreshPrescriptions()
      } catch (refreshError) {
        setPrescriptionFeedback(`Successfully submitted! Your prescription is awaiting review, but submissions could not refresh: ${refreshError.message}`)
      }
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
      const extensionByMimeType = {
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/bmp': 'bmp',
        'image/tiff': 'tiff',
        'image/avif': 'avif',
        'image/heic': 'heic',
        'image/heif': 'heif',
      }
      const extension = extensionByMimeType[file.type] || 'bin'
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
        setAuthMode('reset')
        setAuthFeedback('If this email is registered, a reset code will be sent. Check your inbox and spam/junk folder.')
      } else {
        await apiRequest('/users/reset-password', {
          method: 'POST',
          body: {
            email,
            otp: formData.get('otp') || resetOtp,
            newPassword: formData.get('newPassword'),
            confirmPassword: formData.get('newPassword'),
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
      setAuthMode('reset')
      setOtpResendCountdown(OTP_RESEND_DELAY_SECONDS)
      setAuthFeedback('If this email is registered, a reset code will be sent. Check your inbox and spam/junk folder.')
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
          paymentMethod,
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

  function showHeroSlide(step) {
    setActiveHeroSlide((current) => (
      (current + step + homeHeroSlides.length) % homeHeroSlides.length
    ))
  }

  function applyDeliveryPincode(event) {
    event.preventDefault()
    const pincode = deliveryPincodeDraft.trim()
    if (!/^[1-9]\d{5}$/.test(pincode)) {
      setLocationPickerError('Enter a valid 6-digit Indian PIN code.')
      return
    }

    setDeliveryPincode(pincode)
    setLocationPickerError('')
    try {
      window.localStorage.setItem('medinest-delivery-pincode', pincode)
      setIsLocationPickerOpen(false)
    } catch {
      setLocationPickerError('Your location is updated for this visit, but could not be saved for next time.')
    }
  }

  function openLocationPicker() {
    setDeliveryPincodeDraft(deliveryPincode)
    setLocationPickerError('')
    setIsLocationPickerOpen(true)
  }

  function scrollHealthIssues(direction) {
    const scroller = healthIssueScrollerRef.current
    if (!scroller) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scroller.scrollBy({
      left: direction * Math.min(scroller.clientWidth * 0.8, 620),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <main id="top" className={[
      isCatalogPage && 'catalog-page',
      isCartPage && 'cart-page',
      isOrdersPage && 'orders-page',
      isMedicinesCategory && 'medicines-category-page',
      isPrescriptionPage && 'prescription-page',
      isAccountPage && 'account-page',
    ].filter(Boolean).join(' ')}>
      <header className="store-header">
        <div className="store-header-main">
          <a className="brand" href="/" aria-label="MediNest home">
            <BrandMark />
            <span>Medi<span>Nest</span><small>MEDICINE & HEALTH</small></span>
          </a>
          <button className="market-delivery" type="button" onClick={openLocationPicker} aria-haspopup="dialog" aria-label="Choose delivery location">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
            <span>
              <small>{deliveryPincode ? 'Deliver to' : 'Delivering across'}</small>
              <strong>{deliveryPincode
                ? `${deliveryPincode.startsWith('600') ? 'Chennai ' : ''}${deliveryPincode}`
                : 'India'}</strong>
            </span>
          </button>
          <label className="market-search">
            <span className="market-search-scope">All</span>
            <span className="sr-only">Search medicines and health products</span>
            <input type="search" placeholder="Search medicines and health products" value={search} onChange={(event) => { setActiveHealthIssue(''); setSearch(event.target.value) }} />
            {search && <button type="button" onClick={() => { setActiveHealthIssue(''); setSearch('') }} aria-label="Clear search">×</button>}
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
            <a className="market-wishlist" href="/?view=wishlist" aria-label={`Wishlist${wishlistIds.length ? `, ${wishlistIds.length} saved items` : ''}`}>
              <small>Saved</small>
              <strong>Wishlist{wishlistIds.length > 0 ? ` (${wishlistIds.length})` : ''}</strong>
            </a>
            <a className="market-orders" href="/?view=orders"><small>Returns &</small><strong>Orders</strong></a>
            <a className="icon-cart" href="/?view=cart" aria-label={`View cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}>
              <span aria-hidden="true"><CartIcon /></span><strong>Cart</strong>{cartCount > 0 && <b>{cartCount}</b>}
            </a>
          </div>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          <a className={!isCatalogPage ? 'selected' : ''} href="/">Shop all</a>
          <a className={initialCategory === 'Medicines' ? 'selected' : ''} href="/?category=Medicines">Medicines</a>
          <a className={initialCategory === 'Wellness' ? 'selected' : ''} href="/?category=Wellness">Health products</a>
          <a className={initialCategory === 'Devices' ? 'selected' : ''} href="/?category=Devices">Health tools</a>
          <a className={initialCategory === 'Personal care' ? 'selected' : ''} href="/?category=Personal%20care">Personal care</a>
          <a className={isPrescriptionPage ? 'selected' : ''} href={prescriptionHref}>Prescription service</a>
          <a href="#home-health-articles-title">Health insights</a>
          <a href="#conditions">Health concerns</a>
          <a className={isOrdersPage ? 'selected' : ''} href="/?view=orders">Orders</a>
          {token && <a className={isAccountPage ? 'selected' : ''} href="/?view=account">Account</a>}
          {userRole === 'admin' && <a href="#admin">Admin</a>}
        </nav>
      </header>

      <section className="home-story" aria-label="Welcome to MediNest">
        <div className="home-story-copy">
          <p className="story-eyebrow">A GOOD PLACE TO START</p>
          <h1>Good health is made of little things.</h1>
          <p className="story-intro">The everyday essentials, the things you keep meaning to pick up, and a little help finding what you need.</p>
          <a className="story-link" href={getCategoryHref('Medicines')}>Explore the essentials <span aria-hidden="true">→</span></a>
          <p className="story-footnote"><span aria-hidden="true">✳</span> Thoughtfully chosen for everyday care</p>
        </div>
        <div
          className="home-story-image"
          onTouchStart={(event) => {
            heroTouchStart.current = event.changedTouches[0].clientX
          }}
          onTouchEnd={(event) => {
            if (heroTouchStart.current === null) return
            const swipeDistance = event.changedTouches[0].clientX - heroTouchStart.current
            if (Math.abs(swipeDistance) > 40) showHeroSlide(swipeDistance < 0 ? 1 : -1)
            heroTouchStart.current = null
          }}
          role="group"
          aria-label="Featured MediNest images"
        >
          <img
            key={homeHeroSlides[activeHeroSlide].image}
            src={homeHeroSlides[activeHeroSlide].image}
            alt={homeHeroSlides[activeHeroSlide].alt}
          />
          <span className="hero-image-caption" key={homeHeroSlides[activeHeroSlide].caption} aria-live="polite">{homeHeroSlides[activeHeroSlide].caption}</span>
          <button className="hero-slide-arrow hero-slide-previous" type="button" onClick={() => showHeroSlide(-1)} aria-label="Show previous image">
            <span aria-hidden="true">←</span>
          </button>
          <button className="hero-slide-arrow hero-slide-next" type="button" onClick={() => showHeroSlide(1)} aria-label="Show next image">
            <span aria-hidden="true">→</span>
          </button>
          <div className="hero-slide-dots" aria-label="Choose a featured image">
            {homeHeroSlides.map((slide, index) => (
              <button
                aria-label={`Show image ${index + 1}: ${slide.caption}`}
                aria-current={index === activeHeroSlide ? 'true' : undefined}
                className={index === activeHeroSlide ? 'active' : ''}
                key={slide.caption}
                onClick={() => setActiveHeroSlide(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-shop-categories" aria-labelledby="home-shop-categories-title">
        <div className="home-shop-categories-heading">
          <div>
            <p className="section-kicker">EXPLORE MEDINEST</p>
            <h2 id="home-shop-categories-title">Shop by category</h2>
          </div>
          <a href="/?category=Medicines">Browse all products <span aria-hidden="true">→</span></a>
        </div>
        <div className="home-shop-category-grid">
          {homeShopCategories.map(({ category, image }) => (
            <a className="home-shop-category" href={getCategoryHref(category)} key={category}>
              <span className="home-shop-category-image"><img src={image} alt="" loading="lazy" /></span>
              <span>{categoryLabels[category] || category}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="home-health-products" aria-labelledby="home-health-products-title">
        <div className="home-content-heading">
          <div>
            <p className="section-kicker">EVERYDAY CARE</p>
            <h2 id="home-health-products-title">Popular health essentials</h2>
          </div>
          <a href="/?category=Medicines">View products <span aria-hidden="true">→</span></a>
        </div>
        {catalogLoading ? (
          <p className="home-products-status" role="status">Loading products…</p>
        ) : homeHealthProducts.length ? (
          <div className="home-health-product-grid">
            {homeHealthProducts.map((product) => (
              <article className="home-health-product" key={product.id}>
                <a className="home-health-product-image" href={getCategoryHref(product.category)} aria-label={`Browse ${categoryLabels[product.category] || product.category}`}>
                  <img src={product.image} alt="" loading="lazy" />
                </a>
                <div className="home-health-product-details">
                  {product.oldPrice > product.price && (
                    <span className="home-health-product-discount">
                      {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                    </span>
                  )}
                  <p className="home-health-product-brand">{product.brand} · {categoryLabels[product.category] || product.category}</p>
                  <h3>{product.name}</h3>
                  <div className="home-health-product-price">
                    {product.oldPrice > product.price && <del>{formatINR(product.oldPrice)}</del>}
                    <strong>{formatINR(product.price)}</strong>
                  </div>
                  <button type="button" onClick={() => addToCart(product)} disabled={product.stock < 1}>Add to cart</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="home-products-status">Products will appear here when the catalog is available.</p>
        )}
      </section>

      <section className="service-tiles" id="services" aria-label="Popular services">
        <a className="service-tile rx-tile" href="#medicines">
          <span className="tile-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M12 11v6m-3-3h6" /></svg><b>+</b></span>
          <span><strong>Save on medicines</strong><small>SHOP MEDICINES</small></span><span className="tile-arrow">›</span>
        </a>
        <a className="service-tile upload-tile" href={prescriptionHref}>
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

      <section className="prescription-panel" id="upload-prescription" aria-labelledby="prescription-title">
        {isPrescriptionPage && (
          <div className="prescription-order-hero">
            <div className="prescription-order-hero-copy">
              <p>MEDINEST PRESCRIPTION SERVICE</p>
              <h1>Order via Prescription</h1>
              <span>Upload your prescription and submit it for a secure review.</span>
              <div className="prescription-order-trust">
                <span><b aria-hidden="true">✓</b> Private file handling</span>
                <span><b aria-hidden="true">Rx</b> Review status in your account</span>
                <span><b aria-hidden="true">↥</b> PDF, JPG or PNG</span>
              </div>
            </div>
            <div className="prescription-order-hero-art" aria-hidden="true">
              <svg viewBox="0 0 220 190" fill="none">
                <path d="M37 18h102l36 36v112a9 9 0 0 1-9 9H37a9 9 0 0 1-9-9V27a9 9 0 0 1 9-9Z" fill="#F5FAF8" />
                <path d="M139 18v27a9 9 0 0 0 9 9h27" fill="#DCEBE5" />
                <path d="M139 18v27a9 9 0 0 0 9 9h27" stroke="#C1D8CE" strokeWidth="3" />
                <circle cx="69" cy="79" r="20" fill="#D8EDE3" />
                <path d="M69 68v22m-11-11h22" stroke="#26765C" strokeLinecap="round" strokeWidth="6" />
                <path d="M57 117h89M57 132h72M57 147h52" stroke="#B8D0C5" strokeLinecap="round" strokeWidth="6" />
                <path d="M177 113c17 0 27 13 27 28 0 15-10 26-23 26-12 0-19-9-19-19 0-8 5-13 12-13 6 0 10 4 10 9" stroke="#6EAF91" strokeLinecap="round" strokeWidth="8" />
                <circle cx="193" cy="162" r="7" fill="#F2B75F" />
              </svg>
            </div>
          </div>
        )}
        <div className="prescription-how-card">
          <div className="prescription-how-upload">
            <svg className="prescription-illustration" viewBox="0 0 180 150" fill="none" aria-hidden="true">
              <ellipse cx="83" cy="137" rx="72" ry="7" fill="#CBD8E8" />
              <path d="M37 18a9 9 0 0 1 9-9h92a9 9 0 0 1 9 9v103H37V18Z" fill="#8CB3EC" />
              <path d="M28 25a9 9 0 0 1 9-9h91v105a9 9 0 0 1-9 9H28V25Z" fill="#A9C9F5" />
              <path d="M37 16h90v105a9 9 0 0 1-9 9H37a9 9 0 0 1-9-9V25a9 9 0 0 1 9-9Z" fill="#9FC2F3" />
              <circle cx="49" cy="43" r="13" fill="#6F9FE4" />
              <text x="49" y="47" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">Rx</text>
              <path d="M42 67h60M42 78h60M42 89h60M42 100h47" stroke="#DDEBFF" strokeLinecap="round" strokeWidth="4" />
              <path d="M143 41v64" stroke="#6395D8" strokeLinecap="round" strokeWidth="7" />
              <path d="M143 105v14" stroke="#6395D8" strokeLinecap="round" strokeWidth="7" />
              <path d="M138 36h10v15h-10z" fill="#78A6E5" />
              <path d="M138 119h10v9h-10z" fill="#78A6E5" />
              <path d="M137 34h12" stroke="#6395D8" strokeLinecap="round" strokeWidth="3" />
            </svg>
            <div className="prescription-how-copy">
              <p className="section-kicker">SECURE MEDICINE REVIEW</p>
              <h2 id="prescription-title">Order with Prescription</h2>
              <p>Upload your prescription and we’ll help with your medicine request.</p>
              {isPrescriptionPage ? (
                <button
                  className="prescription-upload-trigger"
                  type="button"
                  onClick={() => {
                    if (token) {
                      setIsPrescriptionFormOpen((isOpen) => !isOpen)
                      return
                    }
                    setAuthMode('login')
                    setAuthFeedback('')
                    setIsAuthOpen(true)
                  }}
                  aria-expanded={isPrescriptionFormOpen}
                  aria-controls="prescription-upload-form"
                >
                  <UploadIcon />
                  {isPrescriptionFormOpen ? 'Close upload' : 'Upload prescription'}
                </button>
              ) : (
                <a className="prescription-upload-trigger" href="/?view=prescriptions">
                  <UploadIcon />
                  Upload
                </a>
              )}
            </div>
            {isPrescriptionPage && token && isPrescriptionFormOpen && (
              <div className="prescription-form-panel" id="prescription-upload-form">
                <p>Select a medicine and upload a PDF or image (JPEG, PNG, GIF, WebP, BMP, TIFF, AVIF, or HEIC/HEIF; up to 5 MB).</p>
                <form className="prescription-upload-form" onSubmit={uploadPrescription}>
                    <label>Medicine
                    <select name="productId" value={prescriptionProductId} onChange={(event) => setPrescriptionProductId(event.target.value)} disabled={prescriptionProductsLoading || prescriptionProducts.length === 0} required>
                        <option value="">{prescriptionProductsLoading ? 'Loading medicines…' : prescriptionProducts.length ? 'Select a medicine' : 'No medicines available'}</option>
                      {prescriptionProducts.map((product) => <option key={product._id} value={product._id}>{product.name}</option>)}
                    </select>
                  </label>
                  <label>Prescription file
                    <input name="prescriptionFile" type="file" accept="application/pdf,image/*,.heic,.heif,.tif,.tiff" disabled={prescriptionProductsLoading || prescriptionProducts.length === 0} required />
                  </label>
                  <button className="checkout-button" type="submit" disabled={isSubmitting || prescriptionProductsLoading || prescriptionProducts.length === 0}>
                    {isSubmitting ? 'Uploading…' : 'Upload for review'}
                  </button>
                </form>
                {!prescriptionProductsLoading && !prescriptionProductsError && prescriptionProducts.length === 0 && (
                  <p className="prescription-empty-state" role="status">
                    No active products are available to attach to this request.
                  </p>
                )}
                {prescriptionProductsError && <p className="prescription-note" role="alert">{prescriptionProductsError}</p>}
                {prescriptionFeedback && <p className="prescription-note" role="status">{prescriptionFeedback}</p>}
              </div>
            )}
          </div>
          <div className="prescription-how-steps">
            <h3>How does this work?</h3>
            <ol>
              <li><span>1</span><p>Sign in to your MediNest account</p></li>
              <li><span>2</span>              <p>Select a medicine and upload your prescription</p></li>
              <li><span>3</span><p>An administrator reviews your submission</p></li>
              <li><span>4</span><p>Check its review status in your account</p></li>
            </ol>
          </div>
        </div>
        {token && (
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
        )}
      </section>

      <section className="home-categories" aria-label="Browse health categories">
        <div className="home-categories-heading">
          <div>
            <p className="story-eyebrow">A FEW PLACES TO BEGIN</p>
            <h2>What can we help with?</h2>
          </div>
          <p>Start with what feels right for you.</p>
        </div>
        <div className="home-category-grid">
          {homeCategories.map((category) => (
            <a className="home-category" href={getCategoryHref(category.category)} key={category.category}>
              <img src={category.image} alt="" loading="lazy" />
              <span className="home-category-copy">
                <small>{category.eyebrow}</small>
                <strong>{category.title}</strong>
                <span>{category.detail}</span>
                <b aria-hidden="true">Explore <span>→</span></b>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="content" id="medicines">
        <div className="catalog-heading">
          <div>
            <p className="section-kicker">{isCatalogPage ? 'SHOP BY CATEGORY' : 'POPULAR PICKS'}</p>
            <h2>{isWishlistPage ? 'Your wishlist' : activeHealthIssue ? `Products for ${activeHealthIssue.toLowerCase()}` : isCatalogPage ? (categoryLabels[activeCategory] || activeCategory) : 'Popular products'}</h2>
            <p className="section-description">{isWishlistPage ? 'Products you saved for later.' : activeHealthIssue ? `Catalog items matching ${activeHealthIssue.toLowerCase()}. Product information is not medical advice.` : isCatalogPage ? `Browse ${categoryLabels[activeCategory] || activeCategory.toLowerCase()} available from MediNest.` : 'Everyday products for you and your family.'}</p>
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
              : activeHealthIssue
              ? `No products matching ${activeHealthIssue.toLowerCase()} are currently available in the catalog.`
              : search.trim()
              ? `No products match “${search.trim()}”.`
              : `No ${isCatalogPage ? categoryLabels[activeCategory] || activeCategory.toLowerCase() : 'products'} are available yet.`}
          </p>
        )}
      </section>

      {apiError && <p className="prescription-note" role="alert">{apiError}</p>}

      <section className="conditions-section" id="conditions">
        <div className="condition-section-heading">
          <div>
            <p className="section-kicker">FIND EVERYDAY ESSENTIALS</p>
            <h2>Shop by health issue</h2>
          </div>
          <div className="condition-carousel-controls">
            <a href="#medicines">View products <span aria-hidden="true">→</span></a>
            <button type="button" onClick={() => scrollHealthIssues(-1)} aria-label="Scroll health issues left">←</button>
            <button type="button" onClick={() => scrollHealthIssues(1)} aria-label="Scroll health issues right">→</button>
          </div>
        </div>
        <div className="condition-grid" ref={healthIssueScrollerRef} aria-label="Health issue categories">
          {conditions.map((condition, index) => (
            <button
              className={`condition-card ${condition.color}`}
              key={condition.name}
              style={{ '--condition-index': index }}
              type="button"
              onClick={() => {
                setActiveHealthIssue(condition.name)
                setSearch(condition.searchTerms[0])
                document.getElementById('medicines')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className="condition-card-copy">
                <small>SHOP BY HEALTH ISSUE</small>
                <strong>{condition.name}</strong>
              </span>
              <img className="condition-card-image" src={condition.image} alt="" loading="lazy" />
              <span className="condition-card-arrow" aria-hidden="true">→</span>
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

      {isMedicinesCategory && brands.length > 0 && (
        <section className="brand-section" id="brands" aria-labelledby="brand-title">
          <div className="section-heading"><h2 id="brand-title">Shop by brand</h2><a className="text-link" href="/?category=Medicines">Shop all medicines <span aria-hidden="true">›</span></a></div>
          <div className="brand-grid">
            {brands.map((brand, index) => (
              <a className="brand-card" key={brand} href={`/?brand=${encodeURIComponent(brand)}`}>
                <BrandLogo brand={brand} index={index} />
                <strong>{brand}</strong>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="orders-section" id="orders" aria-labelledby="orders-title">
        <div className="section-heading"><div><p className="section-kicker">YOUR ACTIVITY</p><h2 id="orders-title">{userRole === 'admin' ? 'All orders' : 'Your recent orders'}</h2></div><span className="order-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span></div>
        {!token ? <div className="orders-empty"><span aria-hidden="true"><CartIcon /></span><p>Sign in to view your orders.</p><button type="button" onClick={() => setIsAuthOpen(true)}>Sign in</button></div> : orders.length === 0 ? <div className="orders-empty"><span aria-hidden="true"><CartIcon /></span><p>Your orders will show here after you place an order.</p><a href="/">Shop products</a></div> : <div className="orders-list">{orders.map((order) => <article className="order-card" key={order._id}><div className="order-card-heading"><div><small>ORDER {String(order._id).slice(-8).toUpperCase()}</small><strong>{order.status}</strong></div><span className="order-status">{paymentMethodLabels[order.paymentMethod] || order.paymentMethod} · {order.paymentStatus}</span></div><p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p><p>{order.deliveryAddress?.streetAddress}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.postalCode}</p><div className="order-card-footer"><span>{new Date(order.createdAt).toLocaleDateString('en-IN')} · {formatINR(order.totalAmount)}</span><button type="button" onClick={() => reorder(order.items)}>Buy again</button>{order.status !== 'Delivered' && order.status !== 'Cancelled' && <button type="button" onClick={() => cancelOrder(order._id)}>Cancel</button>}{userRole === 'admin' && <select aria-label={`Update status for order ${order._id}`} value={order.status} onChange={(event) => updateOrderStatus(order._id, event.target.value)}><option>Order Placed</option><option>Processing</option><option>Shipped</option><option>Delivered</option></select>}</div></article>)}</div>}
      </section>

      {isAccountPage && <section className="profile-section" id="profile" aria-labelledby="profile-title">
        {token ? <>
        <div className="section-heading"><div><p className="section-kicker">ACCOUNT</p><h2 id="profile-title">Your profile and addresses</h2></div></div>
        <form className="profile-form" onSubmit={saveProfile}>
          <label>Name<input value={profileName} onChange={(event) => setProfileName(event.target.value)} required /></label>
          <button type="submit">Save profile</button>
        </form>
        {profileFeedback && <p className="prescription-note" role="status">{profileFeedback}</p>}
        <div className="saved-addresses">
          <div className="address-book-heading">
            <h3>Delivery addresses</h3>
            <p>Add an address to make checkout quicker next time.</p>
          </div>
          <form className="profile-form delivery-address-form" onSubmit={saveDeliveryAddress}>
            <label>Label<input name="label" placeholder="Home, work..." required /></label>
            <label>Recipient name<input name="fullName" autoComplete="name" placeholder="Full name" required /></label>
            <label>Phone<input name="phone" type="tel" inputMode="numeric" autoComplete="tel" pattern="[0-9]{10}" title="Enter a 10-digit phone number" placeholder="10-digit phone number" required /></label>
            <label className="address-street-field">Street address<input name="streetAddress" autoComplete="street-address" placeholder="House number and street" required /></label>
            <label>Locality<input name="locality" autoComplete="address-line2" placeholder="Area or locality" /></label>
            <label>City<input name="city" autoComplete="address-level2" required /></label>
            <label>State<input name="state" autoComplete="address-level1" required /></label>
            <label>PIN code<input name="postalCode" inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" title="Enter a valid 6-digit PIN code" required /></label>
            <label>Country<input name="country" autoComplete="country-name" defaultValue="India" required /></label>
            <button type="submit">Save delivery address</button>
          </form>
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
          {addresses.length === 0 && <p className="address-empty">No saved delivery addresses yet. Add one above when you are ready.</p>}
        </div>
        </> : <div className="account-signin">
          <p className="section-kicker">ACCOUNT</p>
          <h2 id="profile-title">Sign in to manage your account</h2>
          <p>Access your profile and saved delivery addresses after signing in.</p>
          <button className="checkout-button" type="button" onClick={() => { setAuthMode('login'); setAuthFeedback(''); setIsAuthOpen(true) }}>Sign in</button>
        </div>}
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

      <section className="home-health-articles" aria-labelledby="home-health-articles-title">
        <div className="home-content-heading">
          <div>
            <p className="section-kicker">MEDINEST HEALTH INSIGHTS</p>
            <h2 id="home-health-articles-title">Health articles & guides</h2>
          </div>
          <a href="/?category=Wellness">Explore health products <span aria-hidden="true">→</span></a>
        </div>
        <div className="home-health-article-grid">
          {homeHealthArticles.map((article) => (
            <article className="home-health-article" key={article.title}>
              <a className="home-health-article-image" href={article.link} aria-label={article.linkText}>
                <img src={article.image} alt="" loading="lazy" />
              </a>
              <div className="home-health-article-copy">
                <p>{article.category}</p>
                <h3>{article.title}</h3>
                <span>{article.summary}</span>
                <a href={article.link}>{article.linkText} <span aria-hidden="true">→</span></a>
              </div>
            </article>
          ))}
        </div>
        <p className="home-editorial-note">General information only. Follow product instructions and your healthcare professional’s advice.</p>
      </section>

      <section className="home-benefits" id="why-choose-us" aria-labelledby="home-benefits-title">
        <div className="home-benefits-heading">
          <p className="section-kicker">EVERYDAY CARE, MADE EASIER</p>
          <h2 id="home-benefits-title">Why choose MediNest?</h2>
        </div>
        <div className="home-benefit-grid">
          <article className="home-benefit">
            <span className="home-benefit-icon" aria-hidden="true">✓</span>
            <div><h3>Clear product details</h3><p>Review product descriptions, prices, and availability before adding items to your cart.</p></div>
          </article>
          <article className="home-benefit">
            <span className="home-benefit-icon" aria-hidden="true">↗</span>
            <div><h3>Simple ordering</h3><p>Keep selected products in your cart and provide delivery details at checkout.</p></div>
          </article>
          <article className="home-benefit">
            <span className="home-benefit-icon" aria-hidden="true">Rx</span>
            <div><h3>Prescription review</h3><p>Submit a prescription for eligible products and follow its review status in your account.</p></div>
          </article>
          <article className="home-benefit">
            <span className="home-benefit-icon" aria-hidden="true">♡</span>
            <div><h3>Save for later</h3><p>Use your wishlist to keep track of products you may want to revisit.</p></div>
          </article>
        </div>
      </section>

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
          <section>
            <h2>MediNest</h2>
            <a href="#why-choose-us">Why choose us</a>
            <a href="#services">Our services</a>
            <a href="#conditions">Health and wellness</a>
            <a href="#home-health-articles-title">Health guides</a>
          </section>
          <section>
            <h2>Featured categories</h2>
            {homeShopCategories.map(({ category }) => (
              <a href={getCategoryHref(category)} key={category}>{categoryLabels[category] || category}</a>
            ))}
          </section>
          <section>
            <h2>Need help?</h2>
            <a href="/?category=Medicines">Browse medicines</a>
            <a href="/?view=prescriptions">Prescription upload</a>
            <a href="/?view=orders">Your orders</a>
            <a href="/?view=cart">Your cart</a>
          </section>
          <section>
            <h2>Your MediNest account</h2>
            <a href="/?view=account">Profile and addresses</a>
            <a href="/?view=wishlist">Your wishlist</a>
            <a href="/?view=orders">Order history</a>
            <a href="/?view=prescriptions">Prescription submissions</a>
            <p className="footer-social-note">MediNest social channels will be listed here when available.</p>
          </section>
        </div>
        <div className="footer-payment-row">
          <div>
            <h2>Payment at delivery</h2>
            <div className="footer-payment-options"><span>Cash</span><span>UPI</span><span>Card</span></div>
          </div>
          <small>Payment is collected by the delivery person. Online payment is not available.</small>
        </div>
        <div className="footer-brand-row">
          <a className="brand footer-brand" href="/"><BrandMark /><span>Medi<span>Nest</span></span></a>
          <p>Everyday health, made a little easier.</p>
          <small>Follow the directions on the pack and your doctor's advice.</small>
          <small>© {new Date().getFullYear()} MediNest</small>
        </div>
      </footer>

      {cartCount > 0 && !isCartPage && <div className="sticky-cart"><span className="sticky-cart-icon" aria-hidden="true"><CartIcon /></span><div className="sticky-cart-summary"><strong>{formatINR(cartTotal)}</strong><small>{cartCount} {cartCount === 1 ? 'item' : 'items'} added</small></div><a href="/?view=cart">View Cart</a></div>}

      {isLocationPickerOpen && (
        <div className="location-picker-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsLocationPickerOpen(false)
        }}>
          <section className="location-picker" role="dialog" aria-modal="true" aria-labelledby="location-picker-title" aria-describedby="location-picker-description">
            <div className="location-picker-heading">
              <h2 id="location-picker-title">Choose your location</h2>
              <button type="button" onClick={() => setIsLocationPickerOpen(false)} aria-label="Close location picker">×</button>
            </div>
            <div className="location-picker-content">
              <p id="location-picker-description">Enter your PIN code to personalize your delivery location.</p>
              <button className="location-signin-button" type="button" onClick={() => {
                setIsLocationPickerOpen(false)
                if (!token) {
                  setAuthMode('login')
                  setAuthFeedback('')
                  setIsAuthOpen(true)
                } else {
                  window.location.assign('/?view=account')
                }
              }}>
                {token ? 'View your account addresses' : 'Sign in to see your addresses'}
              </button>
              <div className="location-picker-divider"><span>or enter an Indian pincode</span></div>
              <form className="location-pincode-form" onSubmit={applyDeliveryPincode}>
                <label className="sr-only" htmlFor="delivery-pincode">Indian PIN code</label>
                <input
                  id="delivery-pincode"
                  ref={deliveryPincodeInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  pattern="[1-9][0-9]{5}"
                  maxLength="6"
                  placeholder="Enter 6-digit pincode"
                  value={deliveryPincodeDraft}
                  onChange={(event) => {
                    setDeliveryPincodeDraft(event.target.value.replace(/\D/g, '').slice(0, 6))
                    setLocationPickerError('')
                  }}
                  required
                />
                <button type="submit">Apply</button>
              </form>
              {locationPickerError && <p className="location-picker-error" role="alert">{locationPickerError}</p>}
            </div>
          </section>
        </div>
      )}

      {isCartPage && (
        <section className="cart-page-panel" aria-label="Shopping cart">
          <div className="cart-panel-heading"><div><p className="section-kicker">YOUR SHOPPING BAG</p><h2>Your Cart <span>({cartCount})</span></h2></div><a className="text-link" href="/">Continue shopping</a></div>
          {orderPlaced ? <p className="order-success" role="status">Order {placedOrderId} placed successfully. Payment: {paymentMethodLabels[paymentMethod]}.</p> : cart.length === 0 ? <div className="empty-cart"><span aria-hidden="true"><CartIcon /></span><p>Your cart is empty.</p></div> : <>
            <ul className="cart-items">{cart.map((item) => <li className="cart-item" key={item.id}><div><strong>{item.name}</strong><p>{formatINR(item.price)} each</p></div><div className="quantity-controls"><button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button><span>{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button></div></li>)}</ul>
            <div className="cart-total"><span>Subtotal</span><strong>{formatINR(cartTotal)}</strong></div><p className="delivery-note">Choose cash, UPI, or card payment at delivery. Online payment is not collected at checkout.</p>
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
              <label>Payment method<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option value="COD">Cash on Delivery</option><option value="UPI_ON_DELIVERY">UPI at delivery</option><option value="CARD_ON_DELIVERY">Card at delivery</option></select></label>
              <p>Payment is collected by the delivery person. Online checkout is not configured.</p>
              {apiError && <p role="alert">{apiError}</p>}
              <button className="checkout-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Placing order…' : `Place order · ${formatINR(cartTotal)}`}</button>
            </form>}
          </>}
        </section>
      )}

      {isAuthOpen && (authMode === 'reset' ? (
        <div className="auth-backdrop auth-reset-backdrop" ref={authResetBackdropRef}>
          <section className="auth-reset-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <div className="auth-reset-panel">
              <div className="auth-reset-content">
                <p className="section-kicker">BACK TO YOUR MEDINEST ACCOUNT</p>
                <h1 id="auth-title">Reset your password</h1>
                <p className="auth-reset-instructions">
                  Enter the 6-digit code sent to <strong>{resetEmail}</strong> and choose a new password. The code expires in 10 minutes.
                </p>
                <form className="auth-form auth-reset-form" onSubmit={handleAuthSubmit}>
                  <label>Verification code<input name="otp" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" autoComplete="one-time-code" value={resetOtp} onChange={(event) => setResetOtp(event.target.value)} required /></label>
                  <label>New password<input name="newPassword" type="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" required /></label>
                  {authFeedback && <p className="auth-reset-feedback" role="status">{authFeedback}</p>}
                  <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : 'Reset password'}</button>
                </form>
                <p className="auth-reset-resend">
                  Didn’t receive the code?{' '}
                  <button type="button" onClick={resendResetCode} disabled={isSubmitting || otpResendCountdown > 0}>
                    {otpResendCountdown > 0
                      ? `Resend in ${Math.floor(otpResendCountdown / 60)}:${String(otpResendCountdown % 60).padStart(2, '0')}`
                      : 'Resend code'}
                  </button>
                </p>
                <div className="auth-reset-links">
                  <button type="button" onClick={() => { setAuthMode('forgot'); setAuthFeedback('') }}>Use a different email</button>
                  <button type="button" onClick={() => { setAuthMode('login'); setAuthFeedback('') }}>← Back to sign in</button>
                </div>
                <small className="auth-demo-note">Your account actions are handled securely by the MediNest API.</small>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="auth-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsAuthOpen(false)
        }}>
          <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button className="auth-close" type="button" onClick={() => setIsAuthOpen(false)} aria-label="Close sign in">×</button>
            <span className="auth-mark" aria-hidden="true">+</span>
            <p className="section-kicker">WELCOME TO MEDINEST</p>
            <h2 id="auth-title">{authMode === 'login' ? 'Welcome back.' : authMode === 'register' ? 'Create your account.' : 'Reset your password.'}</h2>
            <p className="auth-subtitle">{authMode === 'login' ? 'Sign in to view your cart, orders and account.' : authMode === 'register' ? 'Create an account to shop with MediNest.' : 'Enter your email and we’ll send a secure reset code.'}</p>
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'register' && <label>Your name<input name="fullName" type="text" autoComplete="name" placeholder="Your name" required /></label>}
              <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} required /></label>
              {(authMode === 'login' || authMode === 'register') && <label>Password<input name="password" type="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength={8} placeholder="At least 8 characters" required /></label>}
              <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : authMode === 'login' ? 'Sign in' : authMode === 'register' ? 'Create account' : 'Send reset code'}</button>
            </form>
            {authFeedback && <p className="auth-switch" role="status">{authFeedback}</p>}
            <p className="auth-switch">
              {authMode === 'login' && <>New to MediNest? <button type="button" onClick={() => { setAuthMode('register'); setAuthFeedback('') }}>Create account</button> · <button type="button" onClick={() => { setAuthMode('forgot'); setAuthFeedback('') }}>Forgot password?</button></>}
              {authMode === 'register' && <>Already have an account? <button type="button" onClick={() => { setAuthMode('login'); setAuthFeedback('') }}>Sign in</button></>}
              {authMode === 'forgot' && <button type="button" onClick={() => { setAuthMode('login'); setAuthFeedback('') }}>Back to sign in</button>}
            </p>
            <small className="auth-demo-note">Your account actions are handled by the MediNest API.</small>
          </section>
        </div>
      ))}
    </main>
  )
}

export default App
