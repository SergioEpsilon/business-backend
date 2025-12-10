// Script para asignar rol GUIA a un nuevo usuario
// Reemplaza USER_ID_AQUI con el _id del usuario registrado

const userId = 'USER_ID_AQUI' // Reemplazar con el _id del usuario
const roleId = '69368279168ab8abdccebea4' // ID del rol GUIA

// Insertar en userRole
db.userRole.insertOne({
  user: ObjectId(userId),
  role: ObjectId(roleId),
  _class: 'sb.proyecto.Models.UserRole',
})

print('✅ Rol GUIA asignado al usuario ' + userId)
