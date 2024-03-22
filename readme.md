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

## Directorio _tcp_socket_prueba_
Este direcotrio contiene la api en golang que sirve como servidor centralizado del proyecto.
De esta manera se inicializa la base de datos:
####main.go 
```go #2
func get_db_instance()*sql.DB{
	db, err := sql.Open("mysql", "JavierRoot:1667@tcp(127.0.0.1:3306)/prueba_go")
    if err != nil {panic(err.Error())}
	return db
}
```

## Directorio _preuba_gui_

# Documentacion tecnica
