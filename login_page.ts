import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../store/authstore';
import axios from 'axios';

// Esquema de validación
const loginSchema = yup.object({
  email: yup
    .string()
    .required('El correo es obligatorio')
    .email('Debe ser un correo válido'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'Debe tener al menos 6 caracteres'),
});

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      
      // Llamada al backend
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      // Guardar usuario en el store
      login(response.data.user);
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
        }}
      >
        <Stack spacing={3}>
          {/* Encabezado */}
          <Box sx={{ textAlign: 'center' }}>
            <LoginIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="#1976d2">
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Ingresa tus credenciales para continuar
            </Typography>
          </Box>

          {/* Mensaje de error */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                label="Correo electrónico"
                type="email"
                fullWidth
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                variant="outlined"
              />

              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#1976d2',
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  ¿No tienes cuenta?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/register')}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    Regístrate aquí
                  </Button>
                </Typography>
              </Box>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};