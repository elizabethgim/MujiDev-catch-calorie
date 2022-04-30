import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { awardService } from "../services/awardService";
import { userAuthService } from "../services/userService";

const userAuthRouter = Router();

// 회원가입
userAuthRouter.post("/users/register", async (req, res, next) => {
    try {
        if (is.emptyObject(req.body)) {
            throw new Error("header의 Content-Type을 application/json으로 설정해주세요.");
        }

        const { email, password, name, gender, height, weight, icon } = req.body;

        const newUser = await userAuthService.addUser({
            email,
            password,
            name,
            gender,
            height,
            weight,
            icon,
        });

        if (newUser.errorMessage) {
            throw new Error(newUser.errorMessage);
        }

        return res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

// 로그인
userAuthRouter.post("/users/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userAuthService.getUser({ email, password });

        if (user.errorMessage) {
            throw new Error(user.errorMessage);
        }

        return res.status(201).send(user);
    } catch (error) {
        next(error);
    }
});

// 특정 유저 정보 가져오기
userAuthRouter.get("/users/:id", login_required, async (req, res, next) => {
    try {
        const { id } = req.params;

        const currentUserInfo = await userAuthService.getUserById({ id });
        if (currentUserInfo.errorMessage) {
            throw new Error(currentUserInfo.errorMessage);
        }

        return res.status(200).send(currentUserInfo);
    } catch (error) {
        next(error);
    }
});

// 전체 유저 목록 가져오기
userAuthRouter.get("/users", login_required, async (req, res, next) => {
    try {
        const users = await userAuthService.getUsers();

        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

// 회원 탈퇴하기
userAuthRouter.delete("/users/:id", login_required, async (req, res, next) => {
    try {
        const { id } = req.params;

        await userAuthService.deleteUser({ id });

        await awardService.deleteAward({user_id:id})

        return res.status(200).json({ result: "success" });
    } catch (error) {
        next(error);
    }
});

// 회원 정보 수정하기
userAuthRouter.put("/users/:id", login_required, async (req, res, next) => {
    try {
        // URI로부터 사용자 id를 추출함.
        const { id } = req.params;

        const { name, height, weight, icon, status } = req.body;

        if (name === null || height === null || weight === null || icon == null || status == null) {
            throw new Error("빈 내역이 있습니다 확인해주세요");
        }

        const toUpdate = { name, height, weight, icon, status };

        // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함. 업데이트 요소가 없을 시 생략함
        const updatedUser = await userAuthService.setUser({ id, toUpdate });
        if (updatedUser.errorMessage) {
            throw new Error(updatedUser.errorMessage);
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

// 로그인한 회원 비밀번호 수정
userAuthRouter.put("/password", login_required, async (req, res, next)=>{
    try {
        const id = req.currentUserId;
        const { old_pw, new_pw } = req.body;

        const user = await userAuthService.setPassword({ id, old_pw, new_pw });

        if(!user){
            throw new Error("비밀번호 설정 실패");
        }

        return res.send(user);
    } catch(error){
        next(error)
    }
});

// 임시 비밀번호 발급하기
userAuthRouter.put("/password/init", async(req, res,next)=>{
    try{
        const { email } = req.body;
        const user = await userAuthService.sendNewpassword({ email });
        return res.send("Successfully send");
    } catch(error) {
        next(error)
    }
});

// 깃헙 로그인
userAuthRouter.get("/users/login/github", async (req, res) => {
    try {
        const { code } = req.query;

        const base = "https://github.com/login/oauth/access_token";
        const params = new URLSearchParams({
            client_id: process.env.GITHUB_ID,
            client_secret: process.env.GITHUB_SECRET,
            code,
        }).toString();
        const url = `${base}?${params}`;

        const token = await fetch(url, {
            method: "POST",
            headers: { Accept: "application/json" },
        }).then((res) => res.json());

        const { access_token } = token;
        const api = "https://api.github.com";
        const data = await fetch(`${api}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        }).then((res) => res.json());

        const emailData = await fetch(`${api}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        }).then((res) => res.json());
        const { email } = emailData.find((email) => email.primary === true && email.verified === true);

        // user 정보  처리
        let user = await userAuthService.getUserByEmail({ email });
        if (!user) {
            user = await userAuthService.addUser({
                name: data.name || data.login,
                email,
                description: data.bio || "Hello World!",
            });
        }

        const { _id, name, description, oauth } = user;

        return res.status(200).json({
            token: jwt.sign({ user_id: _id }, process.env.JWT_SECRET_KEY || "secret-key"),
            _id,
            email,
            name,
            description,
            oauth,
        });
    } catch (error) {
        next(error);
    }
});

export { userAuthRouter };
