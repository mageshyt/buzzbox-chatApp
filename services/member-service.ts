import { client } from "@/lib/client";

class MemberService {
  private static instance: MemberService;

  public static getInstance(): MemberService {
    if (!MemberService.instance) {
      MemberService.instance = new MemberService();
    }

    return MemberService.instance;
  }

  async getMember(memberId: string, serverId: string) {
    try {
      const member = await client.member.findFirst({
        where: {
          serverId: serverId,
          profileId: memberId,
        },
        include: {
          profile: true,
        },
      });

      return member;
    } catch (error) {
      console.log("MEMBER SERVICE ERROR", error);

      return null;
    }
  }
}

const memberService = MemberService.getInstance();

export default memberService;
