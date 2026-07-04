const FORM_VARIANTS = {
  create: {
    title: 'Crear Usuario',
    buttonText: 'Registrar',
    showRole: false,
    showPassword: true,
    readOnly: false,
    disabled: false,
  },

  admin: {
    title: 'Crear Usuario',
    buttonText: 'Guardar',
    showRole: true,
    showPassword: true,
    readOnly: false,
    disabled: false,
  },

  edit: {
    title: 'Editar Usuario',
    buttonText: 'Guardar Cambios',
    showRole: true,
    showPassword: false,
    readOnly: false,
    disabled: false,
  },

  view: {
    title: 'Detalle Usuario',
    buttonText: '',
    showRole: true,
    showPassword: false,
    readOnly: true,
    disabled: true,
  },
}

export default FORM_VARIANTS
