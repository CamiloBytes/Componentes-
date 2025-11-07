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
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../store/authstore';
import axios from 'axios';

const registerSchema = yup.object({
  first_name: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'Debe tener al menos 2 caracteres'),
  last_name: yup
    .string()
    .required('El apellido es obligatorio')
    .min(2, 'Debe tener al menos 2 caracteres'),
  email: yup
    .string()
    .required('El correo es obligatorio')
    .email('Debe ser un correo válido'),
  phone: yup
    .string()
    .required('El teléfono es obligatorio')
    .matches(/^[0-9]{10}$/, 'Debe tener 10 dígitos'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'Debe tener al menos 6 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError(null);
      
      const response = await axios.post('http://localhost:4000/api/auth/register', {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      setSuccess(true);
      login(response.data.user);

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error al registrar. Por favor intenta de nuevo.'
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
          maxWidth: 600,
          width: '100%',
          borderRadius: 3,
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ textAlign: 'center' }}>
            <PersonAdd sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="#1976d2">
              Crear Cuenta
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Completa el formulario para registrarte
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success">
              ¡Registro exitoso! Redirigiendo al dashboard...
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    {...register('first_name')}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Apellido"
                    fullWidth
                    {...register('last_name')}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

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
                label="Teléfono"
                fullWidth
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                variant="outlined"
                placeholder="1234567890"
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

              <TextField
                label="Confirmar contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                disabled={isSubmitting || success}
                sx={{
                  backgroundColor: '#1976d2',
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Ya tienes cuenta?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    Inicia sesión aquí
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