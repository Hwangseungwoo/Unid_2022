import * as express from "express";
import { asyncWrapper } from "@lib/common";
import { jsonResponse } from "../types/response";
import TopicApi from "@controllers/topic";
import Authentication from "@middlewares/Auth";

const router = express.Router();

// 리스트 불러오기
router.get(
  "/all/:sortBy",
  asyncWrapper(
    async (req: { params: { sortBy: "latest" | "hot" } }, res: jsonResponse) =>
      await TopicApi.getTopics(req.params.sortBy, res)
  )
);

// 특정 토픽 불러오기
router.get(
  "/:topicId",
  asyncWrapper(
    async (req: { params: { topicId: string } }, res: jsonResponse) =>
      await TopicApi.getTopic(req.params.topicId, res)
  )
);

// 작성
router.post(
  "/",
  Authentication.check(true),
  asyncWrapper(
    async (
      req: { body: { title: string; content: string } },
      res: jsonResponse
    ) => await TopicApi.postTopic(req.body, res.locals.memberUniqueId, res)
  )
);

// 토픽에 찬성, 반대, 거절
router.post(
  ":topicId/likes/:likeType",
  Authentication.check(true),
  asyncWrapper(
    async (
      req: { params: { topicId: string; likeType: string } },
      res: jsonResponse
    ) =>
      await TopicApi.voteTopic(
        req.params.topicId,
        req.params.likeType,
        res.locals.memberUniqueId,
        res
      )
  )
);

// 토픽에 찬성, 반대, 거절 수정
router.put(
  ":topicId/likes/:likeType",
  Authentication.check(true),
  asyncWrapper(
    async (
      req: { params: { topicId: string; likeType: string } },
      res: jsonResponse
    ) =>
      await TopicApi.cancelVote(
        req.params.topicId,
        req.params.likeType,
        res.locals.memberUniqueId,
        res
      )
  )
);

export default router;