import React from 'react';
import LessonService from "../services/LessonService";
import TopicService from "../services/TopicService"
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import TopicItem from "../components/TopicItem";
import LessonEditor from "./LessonEditor";
import {BrowserRouter as Router,Route} from 'react-router-dom'
import WidgetListEditor from './WidgetListEditor'


export default class TopicPill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseId: '',
            moduleId: '',
            lessonId: '',
            topic: {title: ''},
            topics: []
        };

        this.setLessonId = this.setLessonId.bind(this);
        this.setModuleId = this.setModuleId.bind(this);
        this.setCourseId = this.setCourseId.bind(this);
        this.setTopicTitle = this.setTopicTitle.bind(this);
        this.createTopic = this.createTopic.bind(this);
        this.deleteTopic = this.deleteTopic.bind(this);
        this.topicService = TopicService.instance;
    }

    setLessonId(lessonId)
    {
        this.setState({lessonId:lessonId});
    }
    setModuleId(moduleId) {
        this.setState({moduleId: moduleId});
    }
    setCourseId(courseId) {
        this.setState({courseId: courseId});
    }
    setTopicTitle(event) {
        this.setState({topic: {
                title: event.target.value
            }});
    }
    setTopics(topics) {
        this.setState({topics: topics});
    }
    createTopic() {
        let newTopic;
        if(this.state.topic.title === '') {
            newTopic = {title: 'New Topic'};
        } else {
            newTopic = this.state.topic;
        }
        this.topicService
            .createTopic(this.state.courseId, this.state.moduleId, this.state.lessonId, newTopic)
            .then(() => {
                this.findAllTopicsForLesson(this.state.courseId, this.state.moduleId, this.state.lessonId);
            });
        document.getElementById('topicTitleFld').value = '';
        this.setState({topic: {title: ''}});
    }
    deleteTopic(topicId) {
        if(window.confirm('Are you sure you want to delete?')) {
            this.topicService
                .deleteTopic(topicId)
                .then(() => {
                    this.findAllTopicsForLesson(this.state.courseId, this.state.moduleId, this.state.lessonId);
                });
        }
    }
    componentDidMount() {
        this.setLessonId(this.props.lessonId);
        this.setModuleId(this.props.moduleId);
        this.setCourseId(this.props.courseId);
    }
    componentWillReceiveProps(newProps) {
        this.setLessonId(newProps.lessonId);
        this.setModuleId(newProps.moduleId);
        this.setCourseId(newProps.courseId);
        this.findAllTopicsForLesson(newProps.courseId, newProps.moduleId, newProps.lessonId);
    }
    findAllTopicsForLesson(courseId, moduleId, lessonId) {
        this.topicService
            .findAllTopicsForLesson(courseId, moduleId, lessonId)
            .then((topics) => {this.setTopics(topics);});
    }
    renderTopics() {
        if(this.state.topics === null) {
            return null;
        }
        let topics = this.state.topics.map((topic) => {
            return <TopicItem key={topic.id}
                                  topic={topic}
                                  lessonId={this.state.lessonId}
                                  moduleId={this.state.moduleId}
                                  courseId={this.state.courseId}
                                  delete={this.deleteTopic}/>
        });
        return (
            topics
        )
    }

    renderWidgets() {
        return <Route path='/topic/:topicId' component={WidgetListEditor}/>;
    }
    render() {
        if(this.state.topics === null) {
            return null;
        } else {
            return (


                <div>

                    <div>
                    <ul className="nav nav-pills justify-content-right" >
                        {this.renderTopics()}  &nbsp; &nbsp;
                        <li id="addTopicFld" className="nav-item">
                            <a className="nav-link" href="localhost:3000/courses/:courseId/module/:moduleId">
                                <div className='row'>
                                    <div className='col-8'>
                                        <input className='form-control form-control-sm'
                                               id='topicTitleFld'
                                               placeholder='New Topic'
                                               value={this.state.topic.title}
                                               onChange={this.setTopicTitle}/>
                                    </div>
                                    <div className='col-1'>
                                        <button className='btn btn-success btn-sm'
                                                onClick={this.createTopic}>
                                            <i className="fa fa-plus"/>
                                        </button>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                    </div>

                    <div>
                        <Route path={`/course/:courseId/module/:moduleId/lesson/:lessonId/topic/:topicId`}
                               component={WidgetListEditor}/>
                    </div>


                </div>

            )
        }
    }
}