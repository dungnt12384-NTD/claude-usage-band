# usage-band

Mod cho Claude Code (app desktop) hiện một dòng usage ngay trên ô nhập:

`5h ████░░░░░░ 41% 2h10 │ 7d ██░░░░░░░░ 23% 3d │ Ctx ███░░░ 52% │ ~$1.20`

- Thanh tiến độ cho cửa sổ 5 giờ và 7 ngày, kèm thời gian còn lại đến lúc reset.
- Màu: xanh dưới 80%, cam từ 80%, đỏ từ 90%.
- Ctx: mức đầy của cửa sổ ngữ cảnh. Chi phí `~$` chỉ là ước tính.
- Chạy cục bộ, không gọi model nên không tốn token.

## Cài đặt

Trong app desktop: bấm **+** cạnh ô nhập → **Plugins** → **Add marketplace** với `<owner>/claude-usage-band` → **Add plugin** `usage-band` (chọn phạm vi user).

Từ terminal:

```
/plugin install usage-band --marketplace <owner>/claude-usage-band
```

hoặc từ shell:

```
claude plugin install usage-band --marketplace <owner>/claude-usage-band
```
