import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet, 
    TouchableOpacity,
    Text,
    Image,
    Alert } from 'react-native'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps' //para utilizar mapas
import { SvgUri } from 'react-native-svg' //permite usar uma svg com uri externa
import { ScrollView } from 'react-native-gesture-handler'
import api from '../../services/api'
import * as Location from 'expo-location'

interface Item {
    id: number,
    title: string,
    image_url: string,
}

interface Point {
    id: number,
    name: string,
    image: string,
    latitude: number,
    longitude: number,
    image_url: string
}

interface Params {
    uf: string,
    city: string
}

const Points = () => {
    const [items, setItems] = useState<Item[]>([]) //cria um estado
    const [selectedItems, setSelectedItems] = useState<number[]>([]) //itens selecionados
    const [points, setPoints] = useState<Point[]>([]) //pontos selecionados
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]) //posição inicial

    const navigation = useNavigation() //pega o navigation
    const route = useRoute()

    const routeParams = route.params as Params

    //carrega os itens com axios e já atribui ao estado do objeto
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    //carrega posição inicial
    useEffect(() => {
        //pede permissões ao usuário para acessar a localização

        async function loadPosition() {
            //verifica se deu permissão ou não
            const { status } = await Location.requestPermissionsAsync()

            if(status !== 'granted'){
                Alert.alert('Ops...', 'Precisamos da sua permissão para acessar a localização.')
                return
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy:Location.Accuracy.High
            })

            const { latitude, longitude } = location.coords

            setInitialPosition([
                latitude,
                longitude
            ])
        }

        loadPosition()

    }, [])

    //carrega os pontos com axios
    useEffect(() => {
        api.get('points', {
            params: {
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
            }
        }).then(response => {
            setPoints(response.data)
        })        
    }, [selectedItems]) //pois toda vez que seleciona um item, chama novamente

    function handleNavigateBack() {
        navigation.goBack()
    }

    function handleNavigateToDetail(id: number) {
        navigation.navigate('Detail', { point_id: id })
    }

    function handleSelectItem(id: number) {
        //verifica se o item ja foi adicionado ao array
        const alredySelected = selectedItems.findIndex(item => item === id)

        if(alredySelected >= 0){ //ja está no array

            //retira o item do array
            //cria um novo array filtrando o item selecionado, caso o id seja igual ao id passado, pula e não adiciona esse item no array
            const filteredItems = selectedItems.filter(item => item !== id)

            setSelectedItems(filteredItems)
        }else{
            setSelectedItems([...selectedItems, id]) //adiciona o novo item passando o restante do array
        }        
        console.log('clicka no item', id)
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name='arrow-left' size={20} color="#34cb79" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    Bem vindo.
                </Text>
                <Text style={styles.description}>
                    Encontre no mapa um ponto de coleta.
                </Text>
                <View style={styles.mapContainer}>
                    { initialPosition[0] !== 0 && (
                        <MapView
                            style={styles.map}
                            loadingEnabled={initialPosition[0] === 0}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014
                            }}>

                            {
                                //vai colocar as marcas nos pontos
                                points.map(point => (
                                    <Marker
                                        key={String(point.id)}
                                        style={styles.mapMarker}
                                        coordinate={{
                                            latitude: point.latitude,
                                            longitude: point.longitude,
                                            }}
                                        onPress={() => handleNavigateToDetail(point.id)}>
                                        <View style={styles.mapMarkerContainer}>
                                            <Image
                                                style={styles.mapMarkerImage}
                                                source={{
                                                uri: point.image_url
                                            }}/>
                                            <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                        </View>
                                        
                                    </Marker>
                                ))
                            }
                            
                        </MapView>
                    ) }

                    
                </View>
                <View style={styles.itemsContainer}>
                    {/* Scroll view horizontal */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        >
                        {items.map(item => (
                            <TouchableOpacity
                                key={String(item.id)}
                                style={[
                                    styles.item,
                                    selectedItems.includes(item.id) ? styles.selectedItem : {}
                                ]}
                                onPress={() => {handleSelectItem(item.id)}}
                                activeOpacity={0.6}>
                                <SvgUri width={42} height={42} uri={item.image_url} />
                                <Text style={styles.itemTitle}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                        
                    </ScrollView>
                    

                </View>
            </View>
        </>
    )
}

export default Points

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });