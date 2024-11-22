<template>
  <div class="container py-5">
    <div class="row">
      <!-- User Profile Section -->
      <div class="col-md-4">
        <div class="card shadow mb-4">
          <div class="card-body">
            <div class="text-center mb-4">
              <div class="avatar mb-3">
                {{ userInitials }}
              </div>
              <h3 class="mb-1">{{ user.name }}</h3>
              <p class="text-muted">{{ user.email }}</p>
            </div>

            <div class="d-grid gap-2">
              <button
                class="btn btn-outline-primary"
                @click="showEditProfile = true"
              >
                Edit Profile
              </button>
              <button
                class="btn btn-outline-danger"
                @click="handleLogout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Section -->
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-body">
            <h3 class="mb-4">Order History</h3>
            
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <template v-else>
              <div v-if="orders.length === 0" class="text-center py-4">
                <p class="mb-0">No orders yet</p>
              </div>

              <div v-else class="orders-list">
                <div
                  v-for="order in orders"
                  :key="order.id"
                  class="order-item mb-4"
                >
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0">Order #{{ order.id }}</h5>
                    <span :class="getOrderStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </div>

                  <div class="order-details p-3">
                    <div class="row mb-2">
                      <div class="col-6">
                        <small class="text-muted">Date</small>
                        <p class="mb-0">{{ formatDate(order.date) }}</p>
                      </div>
                      <div class="col-6 text-end">
                        <small class="text-muted">Total</small>
                        <p class="mb-0">€{{ order.total.toFixed(2) }}</p>
                      </div>
                    </div>

                    <div class="order-items mt-3">
                      <div
                        v-for="item in order.items"
                        :key="item.id"
                        class="order-item-row"
                      >
                        <div class="d-flex align-items-center">
                          <img
                            :src="item.image"
                            :alt="item.name"
                            class="order-item-image me-3"
                          >
                          <div>
                            <p class="mb-0">{{ item.name }}</p>
                            <small class="text-muted">
                              Quantity: {{ item.quantity }} × €{{ item.price.toFixed(2) }}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div
      class="modal fade"
      :class="{ show: showEditProfile }"
      tabindex="-1"
      :style="{ display: showEditProfile ? 'block' : 'none' }"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Profile</h5>
            <button
              type="button"
              class="btn-close"
              @click="showEditProfile = false"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleUpdateProfile">
              <div class="mb-3">
                <label for="editName" class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="editName"
                  v-model="editForm.name"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="editEmail" class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="editEmail"
                  v-model="editForm.email"
                  required
                >
              </div>

              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="updating"
                >
                  {{ updating ? 'Updating...' : 'Update Profile' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showEditProfile"
      class="modal-backdrop fade show"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Profile',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const loading = ref(false)
    const updating = ref(false)
    const showEditProfile = ref(false)
    const editForm = ref({
      name: '',
      email: ''
    })

    const user = computed(() => store.getters.currentUser)
    const orders = computed(() => store.getters.userOrders)
    
    const userInitials = computed(() => {
      if (!user.value?.name) return ''
      return user.value.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    })

    onMounted(async () => {
      if (!store.getters.isAuthenticated) {
        router.push('/login')
        return
      }

      loading.value = true
      try {
        await store.dispatch('fetchUserOrders')
      } finally {
        loading.value = false
      }

      // Initialize edit form with current user data
      editForm.value = {
        name: user.value.name,
        email: user.value.email
      }
    })

    const handleLogout = () => {
      store.dispatch('logout')
      router.push('/login')
    }

    const handleUpdateProfile = async () => {
      updating.value = true
      try {
        await store.dispatch('updateProfile', editForm.value)
        showEditProfile.value = false
      } catch (error) {
        console.error('Failed to update profile:', error)
      } finally {
        updating.value = false
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getOrderStatusClass = (status) => {
      const statusClasses = {
        'pending': 'badge bg-warning',
        'processing': 'badge bg-info',
        'shipped': 'badge bg-primary',
        'delivered': 'badge bg-success',
        'cancelled': 'badge bg-danger'
      }
      return statusClasses[status.toLowerCase()] || 'badge bg-secondary'
    }

    return {
      user,
      orders,
      loading,
      updating,
      showEditProfile,
      editForm,
      userInitials,
      handleLogout,
      handleUpdateProfile,
      formatDate,
      getOrderStatusClass
    }
  }
}
</script>

<style scoped>
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 auto;
}

.order-item {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
}

.order-details {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.order-item-row {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.order-item-row:last-child {
  border-bottom: none;
}

.order-item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 0.25rem;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
}
</style>
