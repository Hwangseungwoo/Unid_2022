import { jsonResponse, errorList } from "../../types/response";
import TopicService from "@services/topic";
import UserService from "@services/user";

export default class TopicApi {
  static async getTopics(
    sortBy: "latest" | "hot",
    res: jsonResponse
  ): Promise<any> {
    if (!["latest", "hot"].includes(sortBy)) {
      return res.json({ code: -1, result: errorList.NotAllowed });
    }

    const topics = await TopicService.find(sortBy);

    if (topics.length === 0) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    const users = await UserService.findByIds(
      topics.map((topic: any) => topic.wroteBy)
    );

    return res.json({
      code: 0,
      result: {
        topics: topics.map((topic: any) => {
          const user = users.find((user: any) => user.id === topic.wroteBy);
          return { ...topic, userName: user.name };
        }),
      },
    });
  }

  static async getTopic(topicId: string, res: jsonResponse): Promise<any> {
    if (!topicId) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    const topic = await TopicService.findOneById(topicId);

    if (!topic) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    const user = await UserService.findById(topic.wroteBy);

    if (!user) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({
      code: 0,
      result: { topic: { ...topic, userName: user.name } },
    });
  }

  static async postTopic(
    body: {
      title: string;
      content: string;
    },
    memberId: string,
    res: jsonResponse
  ): Promise<any> {
    const { title, content } = body;
    if (!title || !content) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    const topicDoc = await TopicService.insert(title, content, memberId);

    if (!topicDoc) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({ code: 0 });
  }

  static async voteTopic(
    topicId: string,
    voteType: string,
    memberId: string,
    res: jsonResponse
  ) {
    if (!voteType || !topicId) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    if (!["agree", "disagree", "reject"].includes(voteType)) {
      return res.json({ code: -1, result: errorList.NotAllowed });
    }

    const voteResult = await TopicService.voteToTopic(
      voteType,
      topicId,
      memberId
    );
    if (!voteResult) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    const user = await UserService.findById(voteResult.wroteBy);

    if (!user) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({
      code: 0,
      result: { topic: { ...voteResult, userName: user.name } },
    });
  }

  static async cancelVote(
    topicId: string,
    voteType: string,
    memberId: string,
    res: jsonResponse
  ) {
    if (!voteType || !topicId) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    if (!["agree", "disagree", "reject"].includes(voteType)) {
      return res.json({ code: -1, result: errorList.NotAllowed });
    }

    const voteResult = await TopicService.CancelTopic(
      voteType,
      topicId,
      memberId
    );

    if (!voteResult) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    const user = await UserService.findById(voteResult.wroteBy);

    if (!user) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({
      code: 0,
      result: { ...voteResult, userName: user.name },
    });
  }
}