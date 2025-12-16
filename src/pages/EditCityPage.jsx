import styles from "./EditCityPage.module.css";

function EditCityPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Editar ciudad</h1>
        <p className={styles.subtitle}>
          Actualiza la información de la ciudad y guarda los cambios.
        </p>
      </header>

      <section className={styles.card}>
        <p className={styles.placeholder}>
          Aquí irá el formulario para editar la ciudad.
        </p>

        <div className={styles.actions}>
          <button className="btn primary" type="button">Guardar</button>
          <button className="btn ghost" type="button">Cancelar</button>
        </div>
      </section>
    </div>
  );
}

export default EditCityPage;
