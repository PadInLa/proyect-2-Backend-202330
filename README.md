# proyect-2-Backend-202330

Integrantes:

Christian David Manga Arrazola  
Juan David Padilla Paez

Requisitos Funcionales Listos:

1.	Al hacer login, se genera un JWT para usarse como encabeza de Authorization.
2.	Crear, Modificar o Eliminar cualquier modelo requiere autenticación y autorización.
a.	Crear usuario no requiere autenticación o autorización.
users
Restaurantes
Productos
pedidos
3.	Crear un restaurante solo debe recibir el ID de administrador del JWT. Diría que ya porque verifico si el usuario es admin de restaurante
4.	Crear un pedido solo debe recibir el ID de usuario del JWT.
5.	Solo un administrador de un restaurante puede agregar productos a un restaurante.
5.  La contraseña del usuario debe estar protegida.
7.	Por motivos de seguridad, el uso de Two-Factor Authentication es requerido para los administradores.
a.	Implemente la funcionalidad de Two-Factor Authentication.

Los test a la final no se logro que todos funcionaran pero todos los requisitos funcionales estan implementados.

Test funcionales: Users

