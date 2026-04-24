import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";

const API_URL = "https://restcountries.com/v3.1/region/america";

// ── Modal de detalle ────────────────────────────────────────
function CountryModal({ country, onClose }) {
  if (!country) return null;

  const population = new Intl.NumberFormat("es-CO").format(country.population);
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "—";
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => `${c.name} (${c.symbol})`)
        .join(", ")
    : "—";
  const capital = country.capital?.join(", ") ?? "—";

  return (
    <Modal
      visible={!!country}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.panel}>
          <Image
            source={{ uri: country.flags.png }}
            style={modalStyles.flag}
            resizeMode="cover"
          />
          <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
            <Text style={modalStyles.closeText}>✕</Text>
          </TouchableOpacity>
          <ScrollView
            style={modalStyles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={modalStyles.name}>{country.name.common}</Text>
            <Text style={modalStyles.official}>{country.name.official}</Text>
            <View style={modalStyles.grid}>
              {[
                { label: "Subregión",  value: country.subregion ?? "—" },
                { label: "Capital",    value: capital },
                { label: "Población",  value: population },
                { label: "Idiomas",    value: languages },
                { label: "Monedas",    value: currencies },
              ].map(({ label, value }) => (
                <View key={label} style={modalStyles.row}>
                  <Text style={modalStyles.rowLabel}>{label}</Text>
                  <Text style={modalStyles.rowValue}>{value}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Tarjeta de país ─────────────────────────────────────────
function CountryCard({ country, onPress }) {
  const population = new Intl.NumberFormat("es-CO").format(country.population);
  const capital = country.capital?.[0] ?? "—";
  const subregion = country.subregion ?? "—";

  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={() => onPress(country)}
      activeOpacity={0.75}
    >
      <Image
        source={{ uri: country.flags.png }}
        style={cardStyles.flag}
        resizeMode="cover"
      />
      <View style={cardStyles.body}>
        <Text style={cardStyles.name} numberOfLines={1}>
          {country.name.common}
        </Text>
        <Text style={cardStyles.subregion}>{subregion}</Text>
        <View style={cardStyles.meta}>
          <View>
            <Text style={cardStyles.metaLabel}>Capital</Text>
            <Text style={cardStyles.metaValue} numberOfLines={1}>{capital}</Text>
          </View>
          <View>
            <Text style={cardStyles.metaLabel}>Población</Text>
            <Text style={cardStyles.metaValue}>{population}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Componente principal exportado ──────────────────────────
export default function Lista() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("No se pudieron cargar los países. Verifica tu conexión.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
    return () => controller.abort();
  }, []);

  const filtered = countries.filter((c) =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Américas</Text>
        <Text style={styles.headerSub}>
          {countries.length > 0 ? `${countries.length} países en la región` : "Cargando..."}
        </Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar país..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Estado: cargando */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E63946" />
          <Text style={styles.stateText}>Cargando países…</Text>
        </View>
      )}

      {/* Estado: error */}
      {error && !loading && (
        <View style={styles.center}>
          <Text style={{ fontSize: 36 }}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Lista */}
      {!loading && !error && (
        <>
          <Text style={styles.countText}>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </Text>

          {filtered.length === 0 ? (
            <View style={styles.center}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={styles.stateText}>
                No se encontraron países con "{search}"
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.cca3}
              renderItem={({ item }) => (
                <CountryCard country={item} onPress={setSelected} />
              )}
              contentContainerStyle={{ paddingVertical: 8 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {/* Modal detalle */}
      <CountryModal country={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

// ── Estilos ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: "#F5F5F3" },
  header:        { backgroundColor: "#111", paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle:   { fontSize: 26, fontWeight: "800", color: "#FFF", letterSpacing: -0.5 },
  headerSub:     { fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 },
  searchWrapper: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFF",
    marginHorizontal: 16, marginTop: 16, marginBottom: 4,
    borderRadius: 12, paddingHorizontal: 14,
    elevation: 2, shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
  },
  searchIcon:  { fontSize: 18, color: "#aaa", marginRight: 8 },
  searchInput: { flex: 1, height: 46, fontSize: 15, color: "#111" },
  clearBtn:    { fontSize: 14, color: "#aaa", padding: 4 },
  countText:   {
    fontSize: 12, color: "#999", marginHorizontal: 20,
    marginTop: 10, marginBottom: 6, fontWeight: "600",
    textTransform: "uppercase", letterSpacing: 0.4,
  },
  center:      { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  stateText:   { fontSize: 14, color: "#999", textAlign: "center", paddingHorizontal: 32 },
  errorText:   { fontSize: 14, color: "#E63946", textAlign: "center", paddingHorizontal: 32 },
});

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: "row", backgroundColor: "#FFF", borderRadius: 14,
    marginHorizontal: 16, marginVertical: 6, overflow: "hidden",
    elevation: 3, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6,
  },
  flag:       { width: 90, height: 80 },
  body:       { flex: 1, padding: 10, justifyContent: "center" },
  name:       { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 2 },
  subregion:  { fontSize: 11, fontWeight: "600", color: "#E63946", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  meta:       { flexDirection: "row", gap: 16 },
  metaLabel:  { fontSize: 10, fontWeight: "700", color: "#999", textTransform: "uppercase", letterSpacing: 0.4 },
  metaValue:  { fontSize: 12, color: "#444", maxWidth: 100 },
});

const modalStyles = StyleSheet.create({
  backdrop:  { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  panel:     { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden", maxHeight: "80%" },
  flag:      { width: "100%", height: 200 },
  closeBtn:  { position: "absolute", top: 12, right: 12, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20, width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  closeText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  scroll:    { padding: 20 },
  name:      { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 4 },
  official:  { fontSize: 13, color: "#999", fontStyle: "italic", marginBottom: 20 },
  grid:      { gap: 12, paddingBottom: 30 },
  row:       { borderBottomWidth: 1, borderBottomColor: "#f0f0f0", paddingBottom: 10 },
  rowLabel:  { fontSize: 10, fontWeight: "700", color: "#E63946", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2 },
  rowValue:  { fontSize: 14, color: "#333" },
});