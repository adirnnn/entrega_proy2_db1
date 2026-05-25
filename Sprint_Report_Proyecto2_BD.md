# Reporte de Sprint - Proyecto 2: Bases de Datos 1 (Luxor)
**Fecha:** 23 de abril de 2026
**Proyecto:** Luxor Perfumería - Integración Full-Stack y Base de Datos

---

## 1. Product Backlog
El Product Backlog contiene todas las funcionalidades deseadas para el sistema completo de la perfumería.

| ID | Tarea / Funcionalidad | Estado |
|:---|:---|:---|
| PB01 | Diseño de Modelo Entidad-Relación y Relacional | **Terminado** |
| PB02 | Normalización de base de datos hasta 3FN | **Terminado** |
| PB03 | Implementación de DDL (Tablas, Constraints, Índices) | **Terminado** |
| PB04 | Carga masiva de datos de prueba (25+ registros) | **Terminado** |
| PB05 | CRUD completo de Productos en Interfaz Web | **Terminado** |
| PB06 | CRUD completo de Clientes en Interfaz Web | **Terminado** |
| PB07 | Sistema de Autenticación contra Base de Datos | **Terminado** |
| PB08 | Reportes Avanzados (JOINs, Subqueries, CTE, GROUP BY) | **Terminado** |
| PB09 | Transacciones seguras con manejo de Rollback | **Terminado** |
| PB10 | Exportación de reportes a formato CSV | **Terminado** |
| PB11 | Integración de pasarela de pagos (Stripe/PayPal) | *Pendiente (Sprint 3)* |
| PB12 | Dashboard de Administrador para Inventario | *Pendiente (Sprint 3)* |

---

## 2. Sprint Backlog (Sprint Actual)
**Objetivo del Sprint:** Cumplir con todos los requisitos técnicos de la rúbrica del Proyecto 2 de Bases de Datos 1.

| Tarea | Descripción | Puntos de Historia (SP) | Horas Est. | Estado |
|:---|:---|:---:|:---:|:---|
| DB-Design | Creación de Diagrama ER y esquema relacional | 5 | 4 | Terminado |
| SQL-DDL | Script `init.sql` con PK/FK y 4 índices | 3 | 2 | Terminado |
| SQL-Seed | Generación de 150+ filas de prueba reales | 5 | 5 | Terminado |
| BE-Auth | Login validando contra tabla `users` | 3 | 3 | Terminado |
| BE-Trans | Endpoint de venta con BEGIN/COMMIT/ROLLBACK | 8 | 6 | Terminado |
| BE-Reports | Implementación de CTE, Subqueries y JOINs | 8 | 8 | Terminado |
| FE-Dashboard | Interfaz de reportes y visualización de datos | 5 | 5 | Terminado |
| FE-CRUD | Formulario de gestión para Productos y Clientes | 5 | 5 | Terminado |
| Docker | Configuración de orquestación y volúmenes | 2 | 2 | Terminado |

### Calendario de Planificación
- **Semana 1 (13-17 Abril):** Diseño de DB, Normalización, DDL e integración inicial con Docker.
- **Semana 2 (20-23 Abril):** Desarrollo de Backend (Reportes y Transacciones) y Frontend (Dashboard y CRUDs). Pruebas finales.

---

## 3. Incremento
El incremento actual es una aplicación web totalmente funcional desplegada mediante contenedores.

- **Vínculo al repositorio:** [Insertar Link de GitHub Aquí]
- **Funcionalidades planificadas terminadas:**
    1.  Base de datos relacional en 3FN con PostgreSQL.
    2.  Autenticación de usuarios segura.
    3.  Gestión (CRUD) de Productos y Clientes desde la web.
    4.  Módulo de analítica con reportes complejos (Top Categorías, Rendimiento de Empleados).
    5.  Registro de ventas atómico con validación de stock (Transacciones).
    6.  Exportación de datos de empleados a CSV.

---

## 4. Resultados del Sprint

### Gráfico Burndown (Ideal vs. Real)
```
SP
|   * (Día 1: 44 SP)
|    \
|     *
|      \
|       *---* (Día 5: Bloqueo en transacciones)
|            \
|             *
|              \
|               * (Día 10: 0 SP)
+--------------------------- Tiempo (Días)
```

### Métrica de Velocidad
- **Sprint 1 (Sprint Actual):** 44 puntos de historia completados.
- **Velocidad Promedio:** 44 SP/Sprint.

### Indicador Numérico del Éxito
- **Éxito:** 100%
- **Justificación:** Se han completado todas las tareas del Sprint Backlog y se cumplen satisfactoriamente todos los criterios de la rúbrica de evaluación (90 puntos de criterios técnicos + 10 puntos de aplicación web).

### Discusión
El éxito del sprint se basa en la correcta planificación de la base de datos desde el inicio. El mayor desafío fue la implementación de transacciones manuales sin ORM, lo que requirió una gestión cuidadosa de las conexiones de la base de datos para evitar bloqueos.

### Evidencias del Incremento
1. **Dashboard de Reportes:** Muestra visual de las categorías con mayor precio promedio (GROUP BY) y empleados estrella (CTE).
2. **Logs de Docker:** Evidencia de que la base de datos se inicializa y el backend conecta exitosamente.
3. **Archivo CSV:** Reporte descargable generado desde el cliente con datos de rendimiento.

### Retrospectiva del Sprint
- **¿Qué fue bien?:** La estructura de Docker facilitó mucho el despliegue rápido. La base de datos es robusta y los reportes son precisos.
- **¿Qué podría mejorar?:** Se dedicó mucho tiempo a la carga manual de datos (Seed). Para el próximo sprint se recomienda usar una librería de generación de datos (Faker).
- **Acciones:** Investigar automatización de backups de la base de datos para el Sprint 3.

---
*Documento generado para la clase de Bases de Datos 1 - Universidad del Valle de Guatemala*
