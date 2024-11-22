<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Create Account</h2>
            
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="name"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  minlength="8"
                >
                <small class="text-muted">
                  Password must be at least 8 characters long
                </small>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  required
                >
              </div>

              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading || !isFormValid"
                >
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </button>
              </div>

              <div class="text-center mt-3">
                <p class="mb-0">
                  Already have an account?
                  <router-link to="/login" class="text-primary">Login here</router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Register',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const error = ref('')
    const loading = ref(false)

    const isFormValid = computed(() => {
      return (
        name.value.length > 0 &&
        email.value.length > 0 &&
        password.value.length >= 8 &&
        password.value === confirmPassword.value
      )
    })

    const handleSubmit = async () => {
      if (!isFormValid.value) {
        error.value = 'Please check your input and try again.'
        return
      }

      try {
        loading.value = true
        error.value = ''
        
        await store.dispatch('register', {
          name: name.value,
          email: email.value,
          password: password.value
        })
        
        router.push('/')
      } catch (err) {
        error.value = err.message || 'Failed to create account. Please try again.'
      } finally {
        loading.value = false
      }
    }

    return {
      name,
      email,
      password,
      confirmPassword,
      error,
      loading,
      isFormValid,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
  border: none;
}

.btn-primary {
  padding: 0.75rem;
  font-weight: 600;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
}
</style>
