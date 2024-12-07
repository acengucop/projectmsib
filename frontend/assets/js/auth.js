const BASE_URL = window.location.origin;
document.addEventListener('DOMContentLoaded', function() {
    function getCSRFToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 'csrftoken'.length + 1) === ('csrftoken' + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring('csrftoken'.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    

    const registerForm = document.getElementById('registerForm'); 
if (registerForm) {  
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            fullName: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            phone: this.querySelector('input[type="tel"]').value,
            password: this.querySelector('input[type="password"]').value
        };
    
        console.log('Sending registration data:', formData);
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
    
            const data = await response.json();
            console.log('Server response:', data);
    
            if (response.ok) {
                showSuccess(registerForm);
                setTimeout(() => {
                    // Menggunakan URL lengkap
                    window.location.href = 'http://127.0.0.1:5500/frontend/pages/login.html';
                }, 2000);
            } else {
                showError(registerForm, data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            showError(registerForm, 'An error occurred. Please try again.');
        }
    });
}

// Dan di fungsi showSuccess
function showSuccess(form) {
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success mt-3';
    
    const isLoginForm = form.id === 'loginForm';
    successAlert.textContent = isLoginForm 
        ? 'Login successful! Redirecting...' 
        : 'Registration successful! Please check your email to verify your account.';
    
    form.appendChild(successAlert);
    form.reset();
    
    setTimeout(() => {
        successAlert.remove();
        
        if (isLoginForm) {
            window.location.href = 'http://127.0.0.1:5500/frontend/index.html';
        } else {
            window.location.href = 'http://127.0.0.1:5500/frontend/pages/login.html';
        }
    }, 3000);
}

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                email: this.querySelector('input[type="email"]').value,
                password: this.querySelector('input[type="password"]').value
            };

            try {
                const response = await fetch('http://127.0.0.1:8000/api/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken()
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                if (response.ok) {
                    showSuccess(loginForm);
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    showError(loginForm, data.error);
                }
            } catch (error) {
                showError(loginForm, 'An error occurred. Please try again.');
            }
        });
    }
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        const passwordInput = togglePassword.parentElement.querySelector('input[type="password"]');
        
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Form validation
    const authForm = document.querySelector('.auth-form');
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const inputs = this.querySelectorAll('input[required]');
            let isValid = true;
            
            // Check each required input
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showError(input, 'This field is required');
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid email');
                } else if (input.type === 'password' && input.value.length < 6) {
                    isValid = false;
                    showError(input, 'Password must be at least 6 characters');
                } else {
                    removeError(input);
                }
            });
            
            // If form is valid, proceed with submission
            if (isValid) {
                // Here you would typically send the form data to your backend
                // For now, we'll just show a success message
                showSuccess(this);
            }
        });
    }
    
    // Helper functions
    function showError(input, message) {
        const formGroup = input.closest('.mb-3');
        const errorDiv = formGroup.querySelector('.invalid-feedback') || document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        input.classList.add('is-invalid');
        
        if (!formGroup.querySelector('.invalid-feedback')) {
            formGroup.appendChild(errorDiv);
        }
    }
    
    function removeError(input) {
        input.classList.remove('is-invalid');
        const errorDiv = input.closest('.mb-3').querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showSuccess(form) {
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success mt-3';
        
        const isLoginForm = form.id === 'loginForm';
        successAlert.textContent = isLoginForm 
            ? 'Login successful! Redirecting...' 
            : 'Registration successful! Please check your email to verify your account.';
        
        form.appendChild(successAlert);
        form.reset();
        
        setTimeout(() => {
            successAlert.remove();
            
            if (isLoginForm) {
                window.location.href = '../index.html';
            } else {
                // Menggunakan path relatif berdasarkan lokasi file saat ini
                const currentPath = window.location.pathname;
                const newPath = currentPath.replace('register.html', 'login.html');
                window.location.href = newPath;
            }
        }, 3000);
    }

    // Add password confirmation validation for register form
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        const passwordInput = document.querySelector('input[type="password"]:not(#confirmPassword)');
        
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                showError(this, 'Passwords do not match');
            } else {
                removeError(this);
            }
        });
    }

    // Phone number validation
    function isValidPhone(phone) {
        // Adjust regex based on your phone number format requirements
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
    }

    // Add phone validation to form validation
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            if (!isValidPhone(this.value)) {
                showError(this, 'Please enter a valid phone number');
            } else {
                removeError(this);
            }
        });
    }

    // Toggle confirm password visibility
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    if (toggleConfirmPassword) {
        const confirmPasswordInput = toggleConfirmPassword.parentElement.querySelector('input[type="password"]');
        
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Password strength indicator
    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        
        // Contains number
        if (/\d/.test(password)) strength++;
        
        // Contains lowercase
        if (/[a-z]/.test(password)) strength++;
        
        // Contains uppercase
        if (/[A-Z]/.test(password)) strength++;
        
        // Contains special character
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return strength;
    }

    // Add password strength indicator
    const passwordInput = document.querySelector('input[type="password"]');
    if (passwordInput) {
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength mt-2';
        passwordInput.parentElement.parentElement.appendChild(strengthIndicator);
        
        passwordInput.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            let message = '';
            let color = '';
            
            switch(strength) {
                case 0:
                case 1:
                    message = 'Weak';
                    color = 'text-danger';
                    break;
                case 2:
                case 3:
                    message = 'Medium';
                    color = 'text-warning';
                    break;
                case 4:
                case 5:
                    message = 'Strong';
                    color = 'text-success';
                    break;
            }
            
            strengthIndicator.className = `password-strength mt-2 ${color}`;
            strengthIndicator.textContent = `Password strength: ${message}`;
        });
    }

    // Prevent form submission when pressing Enter
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            return false;
        }
    });
});