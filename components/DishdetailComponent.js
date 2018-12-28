import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';

function RenderDish(props) {
    const dish = props.dish;

    if (dish != null) {
        return (
            <Card featuredTitle={dish.name} image={require("./images/uthappizza.png")}>
                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <Icon
                    raised
                    reverse
                    name={props.favorite ? 'heart' : 'heart-o'}
                    type="font-awesome"
                    color="#f50"
                    onPress={() => props.favorite ? console.log("Already favorite") : props.onPress()}
                />
            </Card>
        );
    } else
        return (<View></View>);
}

const RenderComments = (props) => {
    const comments = props.comments;
    const RenderCommentItem = ({ item, index }) => {
        const date = moment(item.date).format("MMM DD, YYYY");
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + date} </Text>
            </View>
        );
    }

    return (
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={RenderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}
class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES,
            comments: COMMENTS,
            favorites: []
        };
        this.markFavorite = this.markFavorite.bind(this);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.setState({ favorites: this.state.favorites.concat(dishId) });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.state.dishes[dishId]}
                    onPress={() => this.markFavorite(dishId)}
                    favorite={this.state.favorites.some(el => el === dishId)} />
                <RenderComments comments={this.state.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

export default Dishdetail;