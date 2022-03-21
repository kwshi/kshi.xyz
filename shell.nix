{ pkgs ? import <nixpkgs> {} }: (pkgs.buildFHSUserEnv {
  name = "kshi.xyz";
  targetPkgs = ps: with ps; [ krb5 e2fsprogs ];
}).env
