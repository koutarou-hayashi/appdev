import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const SearchResultsScreen = ({ route }) => {
  const { params } = route;
  const searchResults = params?.searchResults || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>検索結果</Text>
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>{item.label}</Text>
              <Text style={styles.resultValue}>{item.value}</Text>
              <Text style={styles.resultDetail}>{item.detail}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No results found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  resultItem: {
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultDetail: {
    fontSize: 14,
    color: '#555',
  },
});

export default SearchResultsScreen;