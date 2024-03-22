# Estructure del proyecto
```
.
|__database
|  |__dockerfile
|  |__init.sql
|__tcp_socket_prueba
|  |__cmd
|     |__main.go
|__preuba_gui
   |__src
      |__components
         |__HistoricMonitor
         |__Main
         |__ProcessSim
         |__ProcessTree
         |__RealTimeMonitor
         |__app.tsx
         |__index.tsx
```
## Directorio _database_
Este directorio contiene una archivo docker que inicializa la base de datos.
#### dockerfile
```docker
FROM mysql:latest
COPY init.sql /docker-entrypoint-initdb.d/
```
Cuando se construye la imagen se copia un archivo init.sql en una ubicacion donde docker siempre ejecuta archivos al inicio. El archivo init.sql crea dos tablas y una base de datos si en caso no lo han creado ya.
#### init.sql
```sql
CREATE DATABASE IF NOT EXISTS prueba_go;
USE prueba_go;

CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ram INT,
    cpu INT
);
CREATE TABLE IF NOT EXISTS process_op (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pid INT,
    operation INT
);

```
En el docker compose se puede ver como se le asigna un volumen a la base de datos para permitir la persistencia de datos.
```yaml
service1:
    image: javierpablo/proyecto1_db_mysql:latest
    ports:
      - 1200:3306
    environment:
      - MYSQL_ROOT_PASSWORD=1667
    container_name: db_proyecto1
    volumes:
      - db_volume:/var/lib/mysql
```
tambien se puede observar como se settea la variable de entorno para la contraseña que tiene que coincidir con la variable de entorno de la api en go.
## Directorio _tcp_socket_prueba_
Este direcotrio contiene la api en golang que sirve como servidor centralizado del proyecto.
De esta manera se inicializa la base de datos:
####main.go 
```go #2
func get_db_instance()*sql.DB{
	dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbUser := os.Getenv("DB_USER")
    dbPass := os.Getenv("DB_PASS")
    dataSourceName := fmt.Sprintf("%s:%s@tcp(%s:%s)/prueba_go",dbUser,dbPass, dbHost, dbPort)
    db, err := sql.Open("mysql", dataSourceName)
    if err != nil {panic(err.Error())}
	return db
}
```
Se tienen que settear las variables de entorno correspondientes en el archivo de docker compose
```yaml
  service3:
    image: javierpablo/proyecto1_api_go:latest
    ports:
      - 1400:1200
    environment:
      - DB_USER=root
      - DB_PASS=1667
      - DB_HOST=localhost #127.0.0.1
      - DB_PORT=3306
    container_name: backend_proyecto1
```

Los endopoints que tiene la aplicacion se muestran aca:
```go
http.HandleFunc("/all_pids", all_pids_handler)
http.HandleFunc("/process_info", process_info_handler)
http.HandleFunc("/historical", historical_handler)
http.HandleFunc("/realtime", realtime_handler)
http.HandleFunc("/capacity", total_capacity_handler)
http.HandleFunc("/new_process", new_process_handler)
http.HandleFunc("/save_op_process", save_process_handler)
```
En donde:
- /allpids : muestra todos los pids de los procesos actuales
- /process_info : muestra la informacion de un processo incluido sus processos hijos. En el body de la peticion tiene que especificar un pid
- /hisotical : devuelve un arreglo del historial de consumo de la ram y la cpu. Lo hace consultando a la base de datos
- /realtime : devuelve el porcentaje de consumo de cpu y ram en tiempo real
- /capacity : devuelve la capacidad del cpu y memoria ram
- /capacity : devuelve el pid de un proceso nuevo para poderlo simular
- /capacity : espera un json con un pid y una operacion que se le ha aplicado a dicho processo. Entre los cuales estan: New,Running,Ready y Killed

## Directorio _preuba_gui_
En este directorio se encuentra la aplicacion de front end el cual funciona tambien con variables de entorno para hacer peticiones:
```typescript
const HOST = process.env.GO_HOST;
const PORT = process.env.GO_PORT;


fetch(`http://${HOST}:${PORT}/save_op_process`,{ method:'POST', body:`{"pid":${obj.Pid},"operation":1}`})
                fetch(`http://${HOST}:${PORT}/save_op_process`,{ method:'POST', body:`{"pid":${obj.Pid},"operation":2}`})
                fetch(`http://${HOST}:${PORT}/save_op_process`,{ method:'POST', body:`{"pid":${obj.Pid},"operation":3}`})
```

dichas variables de entorno se tienen que settear en el archivo yaml de docker compose tal como se muestra:
```yaml
  service2:
    image: javierpablo/proyecto1_frontend_react:latest
    ports:
      - 80:3000
    environment:
      - GO_HOST=localhost #127.0.0.1
      - GO_PORT=1400
    container_name: front_proyecto1
    depends_on:
      - service3
```

