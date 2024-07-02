# Sistema-de-Gestion-y-Compra-de-libros-en-linea

Trabajo para laboratorio de software con cesar jaramillo

## Requisitos

## Modulo de administracion de libros

1. El sistema debe estar en la capacidad de permitir ingresar libros con los capos obligatorios los cuales son:
    - Titulo
    - Autor
    - Año de publicacion
    - Genero
    - Numero de paginas
    - Editorial
    - ISSN
    - Idioma
    - Fecha de publicacion
    - Estado
        - Nuevo
        - Usado
    - Precio
2. El sistema debe estar en la capacidad de permitir editar los campos de cada libros
3. El sistema debe estar en la capacidad de permitir eliminar libros
4. El sistema debe estar en la capacidad de llevar el registro de la cantidad de copias de cada libro
5. El sistema debe estar en la capacidad de añadir los libros sin existencias a una categoria de historico
6. El sistema debe permitir añadir, eliminar y editar libros a los usuarios administrador
7. El sistema debe añadir los libros recien añadidos a submodlo de noticias, ya sean libros nuevos o usados
8. El sistema debe añadir de forma automatica un identificador por cada unidad de un libro

### Preguntas

- (1) ¿Se debe poder ingresar cuantas copias de un libro hay?
  R/= N catidad de libros
- (2) ¿Se debe poder editar cada uno de los campos de los libros?
  R/= Se debe editar unicamente el precio, En caso de haber un error editar otros campos
- (3) ¿Se deben eliminar unidades de un libro o todas las existencias?
  R/= Se refiere inactivar los libros
- (5) ¿Se deben añadir de forma automatica los libros que tengan 0 existencias o se realiza de forma manual?
  R/= Automatica
- (6) ¿Los usuarios root deben poder eliminar, editar y añadir libros?
  R/= Los usuarios root solo deben crear administradores
- (7) ¿Durante cuanto tiempo debe estar un libro en el modulo de noticias?
  R/= 8 dias
- (8) ¿Se asumira que los libros que tengan diferentes ediciones se deben trabajar como una sola edicicon donde la unica manera de diferenciarlos es por medio de su identificador?
  R/= Se trabajan como libros diferentes

## Modulo de compra y reserva de libros

1. El sistema debe permitir la busqueda de libros en linea
2. El sistema debe permitir la compra de libros en linea
   - El sistema debe permitir hacer la compra mediante un carrito de compras en linea
   - El sistema debe hacer conexion con el modulo de gestion financiera para el pago de los libros
3. El sistema debe permitir la reserva de libros en linea
   - El sistema solo permitira la reserva de un maximo de 5 libros diferentes por usuario y hasta 3 ejemplares de cada libro
   - El sistema debe permitir la separacion del libro por un plazo de 24 horas
   - El sistema luego de 24 horas debe liberar el libro reservado
4. El sistema debe permitir la cancelacion de la reserva de libros en linea
5. El sistema debe permitir la cancelacion de la compra de libros en linea
6. El sistema debe permitir el acceso al historico de compras realizadas o canceladas por usuario
7. El sistema debe permitir la devolucion de los libros comprados con menos de 8 dias de haber recibido el o los productos
   - El sistema permitira la devolucion bajo las siguientes condiciones:
     - Producto en mal estado
     - Producto no lleno las espectativas del cliente
     - Producto llego en un tiempo superior al estipulado
   - El sistema debera tener un espacio de texto para el cliente pueda explicar el motivo de la devolucion
8. El sistema debe enviar el libro a la direccion de envio del cliente
9. El sistema debe permitir para los usuarios registrados en Colombia la opcion de recoger el libro en la libreria mas cercana
10. El sistema debe permitir a los usuarios cuyo lugar de residencia sea pereira tendran acceso a un mapa con la ubicacion de las librerias mas cercanas
11. El sistema debe permitir la revision del estado de envio del libro
    - PREPARACION
    - ENVIADO
    - ENTREGADO
12. El sistema debe enviar un correo electronico al cliente con un QR u otro al iniciar el proceso de devolucion

### Preguntas

1. (1) ¿El modulo de busqueda debera estar conectado al modulo de compra y reserva de libros?
   R/= No, la busqueda es una visualizacion del producto filtrado por cualquier criterio
3. (2) ¿El modulo de compra y reserva de libros debera estar conectado al modulo de gestion financiera?
   R/= Si
5. (5) ¿Como se hace la cancelacion de la compra ?
   R/= La compra y la reserva tienen una diferencia, en uno se paga en el otro se retraza, tiene 24 horas para pagar, si no paga se cancela la reserva, en la reserva de oculta 
11. (12) ¿Cuales otros metodos se pueden enviar por correo electronico para iniciar el proceso de devolucion?
    R/= En el modulo de devoluciones se maneja por radicados de compras

## Modulo de Usuarios

1. El sistema tendrá 4 tipos de usuario:
   - root
   - administrador
   - cliente
   - visitante
2. El sistema debe permitir crear un cliente con los datos:
    - DNI
    - Nombres
    - apellidos
    - fecha de nacimiento
    - lugar de nacimiento
    - direccion de correspondencia
    - género
    - correo electronico
    - temas literarios de preferencia
    - usuario
    - Contraseña
3. El sistema debe permitir a los usuarios regitstados editar su perfil
4. El sistema debe permitir a los usuarios regitstados suscribirse al sistema de noticias
5. El sistema debe permitir a los usuarios regitstados escoger libros de su preferencia ya sea por:
   - Tema
   - Autor
7. El sistema debe proveerá para cada usuario  un módulo de gestión financiera
8. El sistema creará un usuario root por defecto con:
    - Usuario
    - Contraseña
9. El sistema debe permitir modificar la contraseña del usuario root 
10. El sistema debe permitir unicamente al usuario root crear usuarios administadores
12. El sistema debe permitir crear un administrador con los datos:
    - DNI
    - Nombres
    - apellidos
    - fecha de nacimiento
    - lugar de nacimiento
    - direccion de correspondencia
    - género
    - correo electronico
    - usuario
    - Contraseña
13. El sistema le dará a los usuarios administradores acceso al módulo de administración de libros
14. El sistema no debe permitirle al usuario administrador:
    - Comprar libros
    - Reservar libros
15. El sistema debe permitirle a los usuario visitantes solamente hacer búsquedas de libros
16. El sistema no debe permitirle al usuario root:
    - Comprar libros
    - Reservar libros
17. El sistema debe genera y enviar por correo electronico al usuario cliente el dia de su cumpleaños una tarjeta de felicitación y un bono de descuento válido por un día

## Modulo de Noticias

1. El sistema debe estar en la capacidad de permitir a los usuarios registrados suscribirse al submodulo de las noticias
2. El sistema debe estar ene la capacidad de visualizar el catalogo de nuevos libros

## Modulo de Busqueda

1. El sistema debe permitir buscar libros por los campos ingresados a la hora del registro, los cuales son
    - Titulo
    - Autor
    - Año de publicacion
    - Genero
    - Numero de paginas
    - Editorial
    - ISSN
    - Idioma
    - Fecha de publicacion
    - Estado
        - Nuevo
        - Usado
    - Precio
2. El sistema debe permitir almacenar las busquedas realizadas por los usuarios registrados

### Preguntas

- (2) ¿Se debe guardar las busquedas de los usuarios invitados?
  R/= No

## Modulo de Gestion financiera

1. El sistema debe permitir agregar informacion de tarjetas de credito y debito a los usuarios
2. El sistema debe permitir aumentar el saldo de los usuarios
3. El sistema debe estar en la capacidad de modificar el saldo de los usuarios de acuerdo a las compras
4. El sistema debe permitir modificar el credito del usuario al realizar una devolicion

### Preguntas

- (1) ¿Que tipo de usuario debe poder agregar tarjetas, visitante o registrado?
  R/= Solamente registrados, en una tarjeta se llama saldo en otro cupo

## Modulo de mensajeria

1. El sistema debe permitir que los usuarios interactuen con los administradores via mensajeria instantanea

### Preguntas

- (1) ¿La interaccion entre administradores y usuarios debe realizarce en el mismo sistema como un chat o se pueden usar sistemas de mensajeria externa como WhatsApp, Telegram, etc?
  R/= Preferiblemente un foro, pero solamente el usuario que realizo una solicitud puede verlo, la relacion es de 1 a muchos, un usuario manda el mensaje y todos los administradores pueden ver el mensaje
- (1) ¿Que tipo de usuarios pueden interactuar con los administradores, usuarios registrados o invitados?
  R/= Registrados

## Modulo de Recomendacion

1. El sistema debe permitir realizar recomendaciones por medio de correo electronico basado en compras historicas y busquedas de los usiarios

### Preguntas

- (1) ¿Solo se realizaran recomendaciones a los usuarios registrados?
  R/= Si

## Modulos Extras

1. El sistema debe estar en la capacidad de visualizar en un mapa los puntos fisicos de las tiendas en pereira
2. El sistema debe estar en capacidad de visualizar en realidad aumentada un libro  o una tienda
### Preguntas
- (2) ¿La realidad aumentada puede ser un mapa el cual para moverse puede ser dando click a un espacio predeterminado?
  R/= No
- (2) Ya que hay una clara limitacion con la generacion de los modelos de cada libro, ¿Se puede realizar la visualicacion de un solo libro?
  R/= Si
- (2) ¿Ya que un libro no se puede leer antes de comprarlo, se puede mostrar solo el exteriro del libro permitiendo rotar en varios ejes?
  R/= si

