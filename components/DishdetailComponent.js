import React, { Component } from 'react';
import { View, Text, Modal, FlatList, ScrollView, StyleSheet,Button } from 'react-native';
import { Card, Icon, Rating, Input} from 'react-native-elements';
import moment from 'moment';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = (dispatch) => ({
    postFavorite: dishId => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {
    const dish = props.dish;

    if (dish != null) {
        return (
            <Card featuredTitle={dish.name} image={require("./images/uthappizza.png")}>
                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <View style={styles.viewIcon}>
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type="font-awesome"
                        color="#f50"
                        onPress={() => props.favorite ? console.log("Already favorite") : props.onPress()}
                    />
                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type="font-awesome"
                        color="blue"
                        onPress={() => props.toggleModal()}
                    />
                </View>
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
                <Rating style={{ alignItems:"flex-start" }} startingValue={item.rating} readonly imageSize={12}/>
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
            showModal: false,
            rating: 0,
            author: '',
            comment: ''
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleComment(dishId){
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        resetForm();
    }

    resetForm() {
        this.setState({
            rating: 0,
            author: '',
            comment: ''
        });
        console.log(JSON.stringify(this.state));
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[dishId]}
                    onPress={() => this.markFavorite(dishId)}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    toggleModal={() => this.toggleModal()}
                />
                <Modal
                    animationType='slide'
                    visible={this.state.showModal}
                    transparent={false}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating showRating
                            type='star'
                            startingValue={this.state.rating}
                            onFinishRating={(value) => this.setState({ rating: value })}
                        />
                        <View style={styles.modal}>
                            <Input
                                placeholder='Author'
                                leftIcon={
                                    <Icon
                                        name='user'
                                        type='font-awesome'
                                        size={24}
                                    />
                                }
                                onChangeText={(text) => this.setState({ author: text })}
                            />
                        </View>
                        <View style={styles.modal}>
                            <Input
                                placeholder='Comment'
                                leftIcon={
                                    <Icon
                                        name='comment'
                                        type='font-awesome'
                                        size={22}
                                    />
                                }
                                onChangeText={(text) => this.setState({ comment: text })}
                            />
                        </View>
                        <View style={styles.modal}>
                            <Button
                                onPress={() => { this.handleComment(dishId); this.toggleModal();  }}
                                color="#512DA8"
                                title="SUBMIT"
                            />
                        </View>

                        <View style={styles.modal}>
                            <Button
                                onPress={() => { this.toggleModal();}}
                                color="#808080"
                                title="CANCEL"
                            />
                        </View>
                    </View>
                </Modal>
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    viewIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 10
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);